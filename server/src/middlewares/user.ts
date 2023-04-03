import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token;
        console.log("token", token)
        // token이 존재하지 않는다면 다음 step 진행
        if(!token) return next();
        // username을 JWT_SECRET과 합성하여 생성 token을 생성하였기 때문 
        const { username }: any = jwt.verify(token, 'super_secret');

        const user = await User.findOneBy({ username });
        console.log("user", user);
        // 유저 정보가 없다면 throw error
        if(!user) throw new Error("Unauthenticated");

        // 유저 정보를 res.local.user에 넣어주기
        res.locals.user = user;
        // next를 return해주어야 middleware가 계속 진행됨
        return next();

         // 유저 정보가 있다면 community 이름과 제목이 이미 존재하는 지 여부 체크

        // Community instance 생성 후 database에 저장

        // ★★ 저장한 정보 프론트엔드에 전송 

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Something went wrong" });
    }
}