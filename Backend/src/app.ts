import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import reportRoutes from "./routes/report.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.186.1:3000",
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);

export default app;
