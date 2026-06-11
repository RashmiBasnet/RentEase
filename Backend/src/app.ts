import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import reportRoutes from "./routes/report.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

app.use(bodyParser.json());

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
