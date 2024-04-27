'use client'

import { isJwtUserData } from '@src/types/user'

export function getUserData() {
	if (typeof window === 'undefined') return
	const userData = JSON.parse(localStorage.getItem('userData') ?? '{}')

	if (isJwtUserData(userData)) {
		return userData
	}
	return
}
