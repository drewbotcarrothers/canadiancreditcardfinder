#!/usr/bin/env python3
"""Regenerate src/data/card-videos.json from the YouTube channel + a manual mapping.

Read-only against the YouTube Data API (playlistItems.list on the channel's
uploads playlists, then videos.list). Nothing on YouTube is modified.

    python3 scripts/sync_card_videos.py            # write src/data/card-videos.json
    python3 scripts/sync_card_videos.py --dry-run  # print the result, write nothing

To add a new video: put its ID under "videos" in scripts/card-video-map.json with
the card slugs it covers, then run the command above and commit the JSON.

Auth: reuses the channel OAuth helper (yt.py: token()/api()) from --yt-api-dir
(default /workspace/cccf-youtube/api, or $CCCF_YT_API_DIR). It needs
$YOUTUBE_OAUTH_CLIENT_JSON and token.json there, exactly like the upload tooling.

Merge-safe (2026-10-23): the sync is additive. An entry already in
src/data/card-videos.json is never dropped just because this run could not
fetch it or its status looks wrong; it is kept as-is with a WARN line. The only
way to take a video off the site is to list it under "remove" in
scripts/card-video-map.json ({"<videoId>": "reason"}).

Why: YouTube's uploads playlist (UU...) is not a reliable full listing. On
2026-10-23 it returned DK5D-SIi0BM twice (positions 148 and 150) and left out
9D3djkZIYbM entirely, though that video is public, embeddable and on this
channel. So the ID list is the union of the uploads playlist, the long-form
uploads playlist (UULF...) and every ID that is mapped or already embedded,
and all of them are looked up directly with videos.list.

Rules:
  * Long-form only: Shorts (<= 180 s or '#shorts' in the title) are ignored.
  * Public videos are kept with publishAt = snippet.publishedAt.
  * Private videos are kept only if they have a future status.publishAt
    (scheduled); the site reveals them client-side at that time.
  * Private videos whose publishAt already passed (failed / locked-private) and
    unlisted videos are not added; if one is already embedded it is kept with a
    warning until it is listed under "remove".
  * Mapped card slugs are validated against the live card sheet (same CSV and
    slugify rules as src/lib/data.ts). Unknown slugs abort the sync.
  * Long-form videos that are neither mapped nor skipped are reported so they
    can be triaged; they are not embedded.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CHANNEL_ID = 'UCasiKYjx8foY1AT8OWpccbQ'
UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID[2:]
LONGFORM_PLAYLIST = 'UULF' + CHANNEL_ID[2:]  # long-form uploads only
REPO = Path(__file__).resolve().parent.parent
MAP_PATH = REPO / 'scripts' / 'card-video-map.json'
OUT_PATH = REPO / 'src' / 'data' / 'card-videos.json'
DATA_TS = REPO / 'src' / 'lib' / 'data.ts'
SHORTS_MAX_SECONDS = 180


def slugify(name: str) -> str:
    s = name.lower().replace('+', '-plus-')
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return re.sub(r'(^-|-$)', '', s)


def site_cards() -> dict[str, str]:
    """slug -> card name, from the same Google Sheet CSV the site builds from."""
    m = re.search(r"CSV_URL\s*=\s*'([^']+)'", DATA_TS.read_text())
    if not m:
        sys.exit(f'Could not find CSV_URL in {DATA_TS}')
    with urllib.request.urlopen(m.group(1), timeout=60) as r:
        text = r.read().decode('utf-8')
    cards = {}
    for row in csv.DictReader(io.StringIO(text)):
        name = (row.get('Credit_Card_Name') or '').strip()
        if name:
            cards[slugify(name)] = name
    return cards


def iso_duration_seconds(d: str) -> int:
    m = re.fullmatch(r'P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', d or '')
    if not m:
        return 0
    days, h, mi, s = (int(x or 0) for x in m.groups())
    return days * 86400 + h * 3600 + mi * 60 + s


def short_description(text: str, limit: int = 200) -> str:
    """First line/sentence of the YouTube description, without links/emoji."""
    first = ''
    for line in (text or '').splitlines():
        line = line.strip()
        # Skip link lines, incl. the tracked 'Compare ...: https://...' first line (2026-10-23+).
        if line and not re.match(r'^(👉|🔗|http)', line) and 'http' not in line:
            first = line
            break
    first = re.sub(r'https?://\S+', '', first)
    first = re.sub(r'[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F]', '', first).strip()
    if len(first) > limit:
        cut = first[:limit]
        first = (cut[: cut.rfind(' ')] if ' ' in cut else cut).rstrip(',;: ') + '…'
    return first


def _playlist_ids(yt, tok, playlist_id: str, warnings: list[str]) -> list[str]:
    ids: list[str] = []
    page = None
    while True:
        params = dict(part='contentDetails', playlistId=playlist_id, maxResults=50)
        if page:
            params['pageToken'] = page
        res = yt.api('GET', 'playlistItems', params, tok=tok)
        for it in res.get('items', []):
            ids.append(it['contentDetails']['videoId'])
        page = res.get('nextPageToken')
        if not page:
            break
    dupes = sorted({v for v in ids if ids.count(v) > 1})
    if dupes:
        warnings.append(f'{playlist_id} lists {", ".join(dupes)} more than once; '
                        'that playlist is incomplete, other sources fill the gap')
    return list(dict.fromkeys(ids))


def fetch_channel_videos(api_dir: str, known_ids: list[str], warnings: list[str]) -> list[dict]:
    """All channel videos we can find: uploads playlist + long-form uploads
    playlist + every known (mapped or embedded) ID, each looked up directly."""
    sys.path.insert(0, api_dir)
    import yt  # type: ignore  # channel OAuth helper (token()/api())

    tok = yt.token()
    ids = _playlist_ids(yt, tok, UPLOADS_PLAYLIST, warnings)
    from_uploads = set(ids)
    try:
        ids += _playlist_ids(yt, tok, LONGFORM_PLAYLIST, warnings)
    except Exception as e:  # noqa: BLE001  (optional source)
        warnings.append(f'could not read {LONGFORM_PLAYLIST} ({e}); continuing')
    ids += known_ids
    ids = list(dict.fromkeys(ids))
    print(f'Fetched {len(from_uploads)} uploads from {UPLOADS_PLAYLIST}; '
          f'{len(ids)} IDs after adding {LONGFORM_PLAYLIST} and mapped/embedded IDs', file=sys.stderr)

    videos: list[dict] = []
    for i in range(0, len(ids), 50):
        res = yt.api('GET', 'videos', dict(part='snippet,status,contentDetails', id=','.join(ids[i:i + 50])), tok=tok)
        videos.extend(res.get('items', []))
    found = set()
    out = []
    for v in videos:
        if v['snippet'].get('channelId') != CHANNEL_ID:
            warnings.append(f'{v["id"]} belongs to another channel; ignored')
            continue
        found.add(v['id'])
        out.append(v)
        if v['id'] not in from_uploads:
            warnings.append(f'{v["id"]} is missing from {UPLOADS_PLAYLIST} but found by direct lookup')
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--yt-api-dir', default=os.environ.get('CCCF_YT_API_DIR', '/workspace/cccf-youtube/api'))
    ap.add_argument('--map', default=str(MAP_PATH))
    ap.add_argument('--out', default=str(OUT_PATH))
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--skip-slug-check', action='store_true', help='do not fetch the card sheet (offline)')
    args = ap.parse_args()

    mapping = json.loads(Path(args.map).read_text())
    mapped: dict = mapping.get('videos', {})
    skipped: dict = mapping.get('skip', {})
    removals: dict = mapping.get('remove', {})
    now = datetime.now(timezone.utc)

    out_path = Path(args.out)
    existing: list[dict] = json.loads(out_path.read_text()) if out_path.exists() else []
    existing_by_id = {v['videoId']: v for v in existing}

    out, unmapped, warnings = [], [], []
    videos = fetch_channel_videos(args.yt_api_dir, list(mapped) + list(existing_by_id), warnings)
    seen_long = set()
    for v in videos:
        vid = v['id']
        sn, st, cd = v['snippet'], v['status'], v['contentDetails']
        secs = iso_duration_seconds(cd.get('duration', ''))
        if secs <= SHORTS_MAX_SECONDS or '#shorts' in sn['title'].lower():
            continue
        seen_long.add(vid)
        privacy = st.get('privacyStatus')
        publish_at = None
        if privacy == 'public':
            publish_at = sn['publishedAt']
        elif privacy == 'private' and st.get('publishAt'):
            publish_at = st['publishAt']
            if datetime.fromisoformat(publish_at.replace('Z', '+00:00')) <= now:
                warnings.append(f'{vid} private but publishAt {publish_at} already passed (locked/failed?); dropped')
                continue
        else:
            if vid in mapped:
                warnings.append(f'{vid} is {privacy} with no schedule; dropped')
            continue
        if not st.get('embeddable', True):
            warnings.append(f'{vid} has embedding disabled; dropped')
            continue
        if vid in skipped:
            continue
        if vid not in mapped:
            unmapped.append(f'{vid}  {publish_at[:10]}  {sn["title"]}')
            continue
        m = mapped[vid]
        out.append({
            'videoId': vid,
            'title': m.get('title') or sn['title'].strip(),
            'publishAt': publish_at.replace('.000Z', 'Z'),
            'duration': cd.get('duration'),
            'cards': m['cards'],
            'description': m.get('description') or short_description(sn.get('description', '')),
            'kind': m.get('kind', 'review'),
            '_auto_desc': not m.get('description'),
        })

    for vid in mapped:
        if vid not in seen_long:
            warnings.append(f'{vid} is in the map but not a long-form upload on the channel (deleted/short?)')

    # Merge with what is already embedded. Never drop an existing entry unless
    # it is explicitly listed under "remove" in the map.
    fresh_ids = {v['videoId'] for v in out}
    removed, kept = [], []
    out = [v for v in out if v['videoId'] not in removals]
    for vid, old in existing_by_id.items():
        if vid in removals:
            removed.append(f'{vid}  ({removals[vid]})')
        elif vid not in fresh_ids:
            kept.append(vid)
            warnings.append(f'{vid} is already embedded but this sync did not produce it; kept as-is '
                            '(list it under "remove" in the map to take it off the site)')
            out.append({**old, '_auto_desc': False, '_kept': True})

    cards_by_slug: dict[str, str] = {}
    if not args.skip_slug_check:
        cards_by_slug = site_cards()
        bad = sorted({s for v in out if not v.get('_kept') for s in v['cards'] if s not in cards_by_slug})
        if bad:
            sys.exit('Unknown card slugs in mapping: ' + ', '.join(bad))
        for v in out:
            if v.get('_kept'):
                gone = [s for s in v['cards'] if s not in cards_by_slug]
                if gone:
                    warnings.append(f'{v["videoId"]} (kept) points at unknown card slugs: {", ".join(gone)}')
    for v in out:
        v.pop('_kept', None)
        if v.pop('_auto_desc') and v.get('kind', 'review') == 'review':
            # Older single-card reviews quote welcome offers in their YouTube
            # descriptions; keep the on-page blurb evergreen instead.
            name = cards_by_slug.get(v['cards'][0]) or v['title'].split(' Review')[0].split(' 20')[0]
            v['description'] = (
                f'Video review of the {name}: earn rates, annual fee, welcome offer and who the card suits.'
            )

    out.sort(key=lambda v: v['publishAt'], reverse=True)
    payload = json.dumps(out, indent=2, ensure_ascii=False) + '\n'

    for w in warnings:
        print('WARN', w, file=sys.stderr)
    if unmapped:
        print(f'\n{len(unmapped)} long-form video(s) not in the map (not embedded); add to "videos" or "skip":', file=sys.stderr)
        for u in unmapped:
            print('  ', u, file=sys.stderr)
    added = sorted({v['videoId'] for v in out} - set(existing_by_id))
    changed = sorted(v['videoId'] for v in out
                     if v['videoId'] in existing_by_id and v != existing_by_id[v['videoId']])
    print(f'\nvs {out_path.name}: {len(added)} added, {len(changed)} updated, '
          f'{len(kept)} kept without a fresh fetch, {len(removed)} removed (configured)', file=sys.stderr)
    for vid in added:
        print('   + added  ', vid, file=sys.stderr)
    for vid in changed:
        print('   ~ updated', vid, file=sys.stderr)
    for vid in kept:
        print('   = kept   ', vid, file=sys.stderr)
    for r in removed:
        print('   - removed', r, file=sys.stderr)
    sched = sum(1 for v in out if datetime.fromisoformat(v['publishAt'].replace('Z', '+00:00')) > now)
    cards = {s for v in out for s in v['cards']}
    print(f'\n{len(out)} videos ({sched} scheduled) across {len(cards)} card pages', file=sys.stderr)

    if args.dry_run:
        print(payload)
    else:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(payload)
        print(f'Wrote {args.out}', file=sys.stderr)


if __name__ == '__main__':
    main()
