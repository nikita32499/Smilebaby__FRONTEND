'use client';

import { isJwtUserData } from '@/types/user.types';

export function getUserData() {
    if (typeof window === 'undefined') return;
    const userData = JSON.parse(localStorage.getItem('userData') ?? '{}');

    if (isJwtUserData(userData)) {
        return userData;
    }
    return;
}
