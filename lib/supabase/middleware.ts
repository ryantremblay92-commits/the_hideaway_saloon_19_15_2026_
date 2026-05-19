import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request: NextRequest) => {
    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        },
    );

    // Refresh the session so it doesn't expire
    const { data: { user } } = await supabase.auth.getUser();

    // Role-Based Access Control (RBAC)
    const pathname = request.nextUrl.pathname;

    if (user) {
        // Fetch the user's role from the profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role || 'user';

        // Protect Admin routes
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Protect Staff routes
        /*
        if (pathname.startsWith('/staff') && role !== 'employee' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        */

        // Redirect logged-in users away from auth pages
        if (pathname.startsWith('/auth')) {
            const redirectUrl = role === 'admin' ? '/admin/dashboard' : role === 'employee' ? '/staff/dashboard' : '/account';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
    } else {
        // Redirect non-logged-in users trying to access protected routes
        if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return supabaseResponse;
};
