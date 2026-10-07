#!/usr/bin/env python3
"""Regenerate src/data/card-videos.json from the YouTube channel + a manual mapping.

Read-only against the YouTube Data API (playlistItems.list on the channel's
uploads playlist, then videos.list). Nothing on YouTube is modified.

    python3 scripts/sync_card_videos.py            # write src/data/card-videos.json
    python3 scripts/sync_card_videos.py --dry-run  # print the result, write nothing

To add a new video: put its ID under "videos" in scripts/card-video-map.json with
the card slugs it covers, then run the command above and commit the JSON.

Auth: reuses the channel OAuth helper (yt.py: token()/api()) from --yt-api-dir
(default /workspace/cccf-youtube/api, or $CCCF_YT_API_DIR). It needs
$YOUTUBE_OAUTH_CLIENT_JSON and token.json there, exactly like the upload tooling.

Rules:
  * Long-form only: Shorts (<= 180 s or '#shorts' in the title) are ignored.
  * Public videos are kept with publishAt = snippet.publishedAt.
  * Private videos are kept only if they have a future status.publishAt
    (scheduled); the site reveals them client-side at that time.
  * Private videos whose publishAt already passed (failed / locked-private) and
    unlisted videos are dropped with a warning.
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
        if line and not re.match(r'^(👉|🔗|http)', line):
            first = line
            break
    first = re.sub(r'https?://\S+', '', first)
    first = re.sub(r'[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F]', '', first).strip()
    if len(first) > limit:
        cut = first[:limit]
        first = (cut[: cut.rfind(' ')] if ' ' in cut else cut).rstrip(',;: ') + '…'
    return first


def fetch_channel_videos(api_dir: str) -> list[dict]:
    sys.path.insert(0, api_dir)
    import yt  # type: ignore  # channel OAuth helper (token()/api())

    tok = yt.token()
    ids: list[str] = []
    page = None
    while True:
        params = dict(part='contentDetails', playlistId=UPLOADS_PLAYLIST, maxResults=50)
        if page:
            params['pageToken'] = page
        res = yt.api('GET', 'playlistItems', params, tok=tok)
        for it in res.get('items', []):
            vid = it['contentDetails']['videoId']
            if vid not in ids:  # the uploads playlist can list a video twice
                ids.append(vid)
        page = res.get('nextPageToken')
        if not page:
            break
    videos: list[dict] = []
    for i in range(0, len(ids), 50):
        res = yt.api('GET', 'videos', dict(part='snippet,status,contentDetails', id=','.join(ids[i:i + 50])), tok=tok)
        videos.extend(res.get('items', []))
    return videos


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
    now = datetime.now(timezone.utc)

    videos = fetch_channel_videos(args.yt_api_dir)
    print(f'Fetched {len(videos)} uploads from {UPLOADS_PLAYLIST}', file=sys.stderr)

    out, unmapped, warnings = [], [], []
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

    cards_by_slug: dict[str, str] = {}
    if not args.skip_slug_check:
        cards_by_slug = site_cards()
        bad = sorted({s for v in out for s in v['cards'] if s not in cards_by_slug})
        if bad:
            sys.exit('Unknown card slugs in mapping: ' + ', '.join(bad))
    for v in out:
        if v.pop('_auto_desc') and v['kind'] == 'review':
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
