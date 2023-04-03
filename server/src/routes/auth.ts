import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";
// module 직접 import(자동완성 X)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";



/* SignUp.tsx 에서 보내준 res가 req에 들어있음 */
/* 프론트엔드에서 보내온 요청이 req에 담겨있고 res를 이용하여 결과값을 프론트엔드에게 전송 */ 

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1];
      return prev;
    }, {});
  };

  
const signup =  async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    console.log("email", email)
    
    
    try { 
        let errors: any = {};
    
        // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인.
        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });
    
        // 이미 있다면 errors 객체에 넣어줌.
        if (emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다.";
        if (usernameUser) errors.username = "이미 이 사용자 이름이 사용되었습니다.";
    
        // 에러가 있다면 return으로 에러를 response 보내줌.
        if (Object.keys(errors).length > 0) {
          return res.status(400).json(errors);
        }
    
        const user = new User();
        user.email = email;
        user.password = password;
        user.username = username;
    
        // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
        errors = await validate(user);
    
        if (errors.length > 0) return res.status(400).json(mapError(errors));
    
        // 유저 정보를 user table에 저장.
        await user.save(); 
        return res.json(user);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
      } 
}  

const login = async (req: Request, res: Response) => {
  // client에서 보내준 res가 req.body에 들어있음
  const { username, password } = req.body;
  try {
    let errors: any = {};
    // 비워져있다면 에러를 프론트엔드로 보내주기
    // isEmpty from class-validator
    if (isEmpty(username))
      errors.username = "사용자 이름은 비워둘 수 없습니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 디비에서 유저 찾기
    const user = await User.findOneBy({ username });

    if (!user)
      return res
        .status(404)
        .json({ username: "사용자 이름이 등록되지 않았습니다." });

    // 유저가 있다면 비밀번호 비교하기
    // user.password는 DB에 저장되어 있는 암호화 되어 있는 비밀번호 , password는 client에서 user가 입력한 비밀번호
    // passwordMatches는 true 또는 false 반환
    const passwordMatches = await bcrypt.compare(password, user.password); 

    // 비밀번호가 다르다면 에러 보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });
    }

    // 비밀번호가 맞다면 username과 JWT_SECRET을 합쳐서 토큰 생성
    const token = jwt.sign({ username }, 'super_secret');

    // 쿠키저장
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// ②핸들러 호출 되면 res에 정보 담아 getServerSideProps로 res전달
const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // 바로 expires 될 수 있게 Date인자로 0을 입력
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ success: true });
};

// api 생성
const router = Router();

// ①쿠키가 있다면 /me에서 req 받은 후 그 쿠키(req)를 이용해서 middlewares 거친 후 me핸들러 호출
router.get("/me", userMiddleware, authMiddleware, me)
router.post("/signup", signup);
router.post("/login", login);
// 로그인 된 user만이 로그아웃을 할 수 있기 때문에 middleware를 거친 후(로그인 여부 체크) logout핸들러를 호출해야함
router.post("/logout", userMiddleware, authMiddleware, logout);



export default router;