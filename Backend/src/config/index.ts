import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/rentease_database";
export const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

// Google OAuth (Continue with Google). Client ID/secret come from a Google Cloud
// OAuth 2.0 "Web application" credential. The callback URL must be registered as an
// authorized redirect URI there and points at the Next.js callback route, not the API.
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL: string =
    process.env.GOOGLE_CALLBACK_URL || `${CLIENT_URL}/api/auth/google/callback`;

// Khalti ePayment (KPG-2). Sandbox keys come from test-admin.khalti.com,
// live keys from admin.khalti.com — switch KHALTI_BASE_URL to match the key.
export const KHALTI_SECRET_KEY: string = process.env.KHALTI_SECRET_KEY || "";
export const KHALTI_BASE_URL: string =
    process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";