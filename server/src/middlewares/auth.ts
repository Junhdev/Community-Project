import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
    const user: User | undefined = res.locals.user;
    
    // user정보가 없을때 & 로그아웃시에도 throw Error
    if (!user) throw new Error("Unauthenticated");

    return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthenticated" });
    }
};