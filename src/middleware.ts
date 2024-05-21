import { validateToken } from '@/hook/validateToken';
import { NextRequest, NextResponse } from 'next/server';

function notFound(request: NextRequest) {
    return NextResponse.error();
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authorization');
    const currentPath = request.nextUrl.pathname;

    if (currentPath.startsWith('/panel/admin')) {
        if (!token?.value) return notFound(request);
        const userData = await validateToken(token.value);
        if (!userData) {
            request.cookies.delete('authorization');
            console.log('DELETE COOKIE {authorization}', token.value);
            return notFound(request);
        }
        if (userData.role !== 'admin' && userData.role !== 'moderator') {
            return notFound(request);
        }
    }
    return NextResponse.next();
}
