import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/rentease_database";
export const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

// Khalti ePayment (KPG-2). Sandbox keys come from test-admin.khalti.com,
// live keys from admin.khalti.com — switch KHALTI_BASE_URL to match the key.
export const KHALTI_SECRET_KEY: string = process.env.KHALTI_SECRET_KEY || "";
export const KHALTI_BASE_URL: string =
    process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";