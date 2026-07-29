import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { completeGoogleLogin } from "@/lib/api/auth/auth";
import { clearOAuthState, getOAuthState, setAuthToken, setUserData } from "@/lib/cookie";

// Handles Google's redirect back: verify the CSRF state, exchange the code for a
// session via the API, persist the auth cookies, and land the user in the app.
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const fail = async (message: string) => {
        await clearOAuthState();
        return NextResponse.redirect(
            new URL(`/sign-in?error=${encodeURIComponent(message)}`, request.url)
        );
    };

    if (params.get("error")) {
        return fail("Google sign-in was cancelled.");
    }

    const code = params.get("code");
    const state = params.get("state");
    const savedState = await getOAuthState();

    if (!code || !state || !savedState || state !== savedState) {
        return fail("Google sign-in could not be verified. Please try again.");
    }

    await clearOAuthState();

    try {
        const result = await completeGoogleLogin(code);
        const { token, user } = result.data;

        await setAuthToken(token);
        await setUserData(user);

        const firstName = (user?.fullName || "").split(" ")[0] || "there";
        const destination = new URL(
            user?.role === "admin" ? "/admin" : "/home",
            request.url
        );
        // Carries a signal the landing page turns into a welcome toast, then strips.
        destination.searchParams.set("welcome", firstName);
        return NextResponse.redirect(destination);
    } catch (err: Error | any) {
        return fail(err.message || "Google sign-in failed.");
    }
}
