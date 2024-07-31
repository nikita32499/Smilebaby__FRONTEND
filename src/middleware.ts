import { getUser } from 'entities/user/lib/@x/getUser';
import { validateToken } from 'entities/user/lib/@x/validateToken';
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
            return notFound(request);
        }
        const user = await getUser(userData.userId);
        if (!user) return notFound(request);

        if (user.role !== 'admin' && user.role !== 'moderator') {
            return notFound(request);
        }
    }
    return NextResponse.next();
}
