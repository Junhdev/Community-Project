import { Router, Request, Response } from "express";
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import { AppDataSource } from "../data-source";
import { isEmpty } from "class-validator";
import Community from "../entities/Community";
import { User } from "../entities/User";
import Post from "../entities/Post";

// 커뮤니티 유효성 & 생성 핸들러
const createCommunity = async (req: Request, res: Response, next) => {
    const { name, title, description } = req.body;

    // user정보가 있다면 community의 이름과 제목이 Community 엔티티에 이미 존재 하는 지 여부 체크
    try {
        let errors: any = {};
        if (isEmpty(name)) errors.name = "이름은 비워둘 수 없습니다.";
        if (isEmpty(title)) errors.title = "제목은 비워두 수 없습니다.";
    
        const community = await AppDataSource.getRepository(Community)
        .createQueryBuilder("community")
        .where("lower(community.name) = :name", { name: name.toLowerCase() })
        .getOne();
    
        if (community) errors.name = "커뮤니티명이 이미 존재합니다.";

        // 공란이거나 이미 존재하는 커뮤니티명일 때 error 호출
        if (Object.keys(errors).length > 0) {
            throw errors;
        }
        } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
        }
    
        // community 생성 로직
        // Community Instance 생성 후 database에 저장
    try {
        const user: User = res.locals.user;
        
        const community = new Community();
        community.name = name;
        community.description = description;
        community.title = title;
        community.user = user;
        
        // database에 저장
        await community.save();

        // 저장한 정보 프론트엔드로 전달
        return res.json(community);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "문제가 발생했습니다." });
        }    
    
}

// post갯수 상위인 커뮤니티 핸들러
const topCommunities = async (req: Request, res: Response) => {
    try {
        const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' ||s."imageUrn",'https://www.gravatar.com/avatar?d=mp&f=y')`;
        const communities = await AppDataSource.createQueryBuilder()
        .select(
            `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
        )
        .from(Community, "s")
        .leftJoin(Post, "p", `s.name = p."subName"`)
        .groupBy('s.title, s.name, "imageUrl"')
        .orderBy(`"postCount"`, "DESC")
        .limit(5)
        .execute();
        return res.json(communities);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
};

const router = Router();

// '/'주소로 req 들어올 시 userMiddleware와 authMiddleware 호출 후 createCommunity 핸들러가 호출됨
router.post("/", userMiddleware, authMiddleware, createCommunity);
// 비회원 user들도 커뮤니티 페이지 접근 가능
router.get("/community/topCommunities", topCommunities);

export default router;