import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers["authorization"];
    const decode = jwt.verify(header as string, JWT_PASSWORD);
    if (decode) {
        //@ts-ignore
        req.userId = decode.id;
        next();
    } else {
        res.status(403).json({
            message: "You are not logged in !",
        });
    }
};
