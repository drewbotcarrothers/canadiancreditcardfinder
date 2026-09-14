import { useCallback, useEffect, useState } from 'react';

const SEARCH_CHANGE_EVENT = 'cccf:searchchange';

function currentSearch() {
    return typeof window === 'undefined' ? '' : window.location.search;
}

export function useUrlSearchParams() {
    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        const sync = () => setSearch(window.location.search);
        sync();
        window.addEventListener('popstate', sync);
        window.addEventListener(SEARCH_CHANGE_EVENT, sync);
        return () => {
            window.removeEventListener('popstate', sync);
            window.removeEventListener(SEARCH_CHANGE_EVENT, sync);
        };
    }, []);

    const searchParams = new URLSearchParams(search);

    const pushSearch = useCallback((params: URLSearchParams, pathname = window.location.pathname) => {
        const qs = params.toString();
        const url = qs ? `${pathname}?${qs}` : pathname;
        window.history.pushState({}, '', url);
        window.dispatchEvent(new Event(SEARCH_CHANGE_EVENT));
    }, []);

    const replaceSearch = useCallback((params: URLSearchParams, pathname = window.location.pathname) => {
        const qs = params.toString();
        const url = qs ? `${pathname}?${qs}` : pathname;
        window.history.replaceState({}, '', url);
        window.dispatchEvent(new Event(SEARCH_CHANGE_EVENT));
    }, []);

    return { searchParams, pushSearch, replaceSearch };
}
