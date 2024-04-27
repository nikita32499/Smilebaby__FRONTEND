import { validateToken } from '@/hook/validateToken';
import { NextRequest, NextResponse } from 'next/server';

function toLogin(request: NextRequest) {
    return NextResponse.redirect(new URL('/panel/login', request.url));
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authorization');
    const currentPath = request.nextUrl.pathname;

    if (currentPath.startsWith('/panel/admin')) {
        if (!token?.value) return toLogin(request);
        const userData = await validateToken(token.value);
        if (!userData) {
            request.cookies.delete('authorization');
            console.log('DELETE COOKIE {authorization}', token.value);
            return toLogin(request);
        }
        if (userData.role !== 'admin' && userData.role !== 'moderator') {
            return toLogin(request);
        }
    }
    return NextResponse.next();
}
