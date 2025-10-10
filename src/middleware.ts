import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export default function middleware(request: NextRequest) {
 
  if (request.nextUrl.pathname == '/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (
   
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!request.cookies.has('token') &&
    !request.cookies.has('permissions')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (request.cookies.has('permissions')) {
      const permissionString: any = request.cookies.get('permissions')?.value;
      const availablePermissions = JSON.parse(permissionString);
      const requestedRoute = request.nextUrl.pathname;
      const found = availablePermissions.some(
        (permission: any) =>
          // requestedRoute.includes(permission.url)
          requestedRoute === permission.url
      );
      const foundInside = availablePermissions.some(
        (item: any) =>
          item.children.length > 1 &&
          item.children.some(
            (childrenItem: any) =>
              // requestedRoute.includes(childrenItem.url)
              requestedRoute === childrenItem.url
          )
      );
      if (found || foundInside) {
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL('/admin/not-found', request.url));
      }
    }
  }
  if (request.nextUrl.pathname == '/login') {
    if (request.cookies.has('token')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
}

