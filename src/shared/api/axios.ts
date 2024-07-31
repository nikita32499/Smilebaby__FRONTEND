'use client';
import _axios_ from 'axios';
import { REACT_BASE_API_URL } from 'shared/config/constants';

export const appAxios = _axios_.create({
    baseURL: `${REACT_BASE_API_URL}/api`,
    headers: {
        'Cache-Control': 'no-store',
    },
});
