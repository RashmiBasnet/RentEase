import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config";
import { HttpError } from "../errors/http-error";

export interface GoogleIdentity {
    googleId: string;
    email: string;
    emailVerified: boolean;
    name: string;
}

export function isConfigured(): boolean {
    return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

function getClient(): OAuth2Client {
    if (!isConfigured()) {
        throw new HttpError(503, "Google sign-in is not configured on this server");
    }
    return new OAuth2Client({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: GOOGLE_CALLBACK_URL,
    });
}

export function getAuthUrl(state: string): string {
    return getClient().generateAuthUrl({
        scope: ["openid", "email", "profile"],
        state,
        access_type: "online",
        prompt: "select_account",
    });
}

export async function exchangeCode(code: string): Promise<GoogleIdentity> {
    const client = getClient();

    let idToken: string | null | undefined;
    try {
        const { tokens } = await client.getToken(code);
        idToken = tokens.id_token;
    } catch {
        throw new HttpError(401, "Google sign-in failed. Please try again.");
    }

    if (!idToken) {
        throw new HttpError(401, "Google sign-in failed. Please try again.");
    }

    const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
        throw new HttpError(401, "Google did not return an email address for this account.");
    }

    return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified === true,
        name: payload.name || payload.email.split("@")[0],
    };
}
