import _axios_ from 'axios';

export const appAxios = _axios_.create({
    baseURL: `${window.location.origin}/api`,
    headers: {
        'Cache-Control': 'no-store',
    },
});
