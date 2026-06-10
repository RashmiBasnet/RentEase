import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { HttpError } from "../errors/http-error";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser;
        }
    }
}

const userRepository = new UserRepository();

export const authorizedMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new HttpError(401, "Unauthorized, Header malformed");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new HttpError(401, "Unauthorized, Token missing");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as Record<string, any>;
        if (!decodedToken?.id) {
            throw new HttpError(401, "Unauthorized, Token invalid");
        }

        const user = await userRepository.getUserById(decodedToken.id);
        if (!user) {
            throw new HttpError(401, "Unauthorized, User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        const err = error as Error & { statusCode?: number };
        return res.status(err.statusCode || 401).json({
            success: false,
            message: err.message || "Unauthorized",
        });
    }
};

export const adminOnlyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.role === "admin") {
            next();
            return;
        }

        throw new HttpError(403, "Forbidden, Admins only");
    } catch (error) {
        const err = error as Error & { statusCode?: number };
        return res.status(err.statusCode || 403).json({
            success: false,
            message: err.message || "Forbidden",
        });
    }
};
