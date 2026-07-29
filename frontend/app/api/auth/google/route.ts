import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { startGoogleLogin } from "@/lib/api/auth/auth";
import { setOAuthState } from "@/lib/cookie";

// Kicks off "Continue with Google": mint a CSRF state, stash it in a cookie, ask the
// API for the Google consent URL, and send the browser there.
export async function GET(request: NextRequest) {
    try {
        const state = randomUUID();
        await setOAuthState(state);

        const result = await startGoogleLogin(state);
        return NextResponse.redirect(result.data.url);
    } catch (err: Error | any) {
        const message = err.message || "Could not start Google sign-in";
        return NextResponse.redirect(
            new URL(`/sign-in?error=${encodeURIComponent(message)}`, request.url)
        );
    }
}
