import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";
// module 직접 import(자동완성 X)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import authCommunityMiddleware from "../middlewares/authCommunity";
import authMiddleware from "../middlewares/auth";


const invite = async (req: Request, res: Response) => {
    // client에서 보내준 res가 req.body에 들어있음
    const { communityname } = req.body;
    try {
      let errors: any = {};
      // 비워져있다면 에러를 프론트엔드로 보내주기
      // isEmpty from class-validator
      
  
      // 디비에서 유저 찾기
      const user = await User.findOneBy({ username });
  
      if (!user)
        return res
          .status(404)
          .json({ username: "사용자 이름이 등록되지 않았습니다." });
  
      // 유저가 있다면 비밀번호 비교하기
      // user.password는 DB에 저장되어 있는 암호화 되어 있는 비밀번호 , password는 client에서 user가 입력한 비밀번호
      // passwordMatches는 true 또는 false 반환
   
  
     
  
      // 비밀번호가 맞다면 username과 JWT_SECRET을 합쳐서 토큰 생성
      const token = jwt.sign({ communityname }, process.env.JWT_SECRET);
  
      // 쿠키저장
      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        })
      );
  
      return res.json({ username, communityname, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  };

  const router = Router();
  router.post("/", authCommunityMiddleware, invite);