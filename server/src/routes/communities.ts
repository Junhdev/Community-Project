import { Router, Request, Response, NextFunction } from "express";
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import { AppDataSource } from "../data-source";
import { isEmpty } from "class-validator";
import Community from "../entities/Community";
import { User } from "../entities/User";
import Post from "../entities/Post";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { makeId } from "../utils/helpers";

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
        return res.status(500).json({ error: "문제가 발생했습니다1." });
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
            return res.status(500).json({ error: "문제가 발생했습니다2." });
        }    
    
}

// post갯수 상위인 커뮤니티 생성 핸들러
const topCommunities = async (req: Request, res: Response) => {
    try {
        const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' ||c."imageUrn",'https://www.gravatar.com/avatar?d=mp&f=y')`;
        const communities = await AppDataSource.createQueryBuilder()
        .select(
            `c.title, c.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
        )
        .from(Community, "c")
        .leftJoin(Post, "p", `c.name = p."communityname"`)
        .groupBy('c.title, c.name, "imageUrl"')
        .orderBy(`"postCount"`, "DESC")
        .limit(5)
        .execute();
        // client로 전송
        return res.json(communities);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
};


const getCommunity = async (req: Request, res: Response) => {
    // req.params { name: 'test1' }
    const name = req.params.name;
    try {
        const community = await Community.findOneByOrFail({ name });

      // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
        
        // 프론트에 전송
        return res.json(community);
    } catch (error) {
        return res.status(404).json({ error: "커뮤니티를 찾을 수 없습니다." });
    }
};

// 로그인한 유저가 생성한 커뮤니티인지 확인하기 위한 핸들러
const myCommunity = async (req: Request, res: Response, next: NextFunction) => {
    // 현재 로그인되어 있는 유저
    const user: User = res.locals.user;
    try {
        const community = await Community.findOneOrFail({ where: { name: req.params.name } });
        
        if (community.username !== user.username) {
            return res
            .status(403)
            .json({ error: "이 커뮤니티를 소유하고 있지 않습니다." });
        }

        res.locals.community = community;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: " 문제가 발생했습니다." });
    }
};


const upload = multer({
    storage: multer.diskStorage({
        destination: "public/images",
        // 저장되는 파일 이름 생성
        filename: (_, file, callback) => {
            const name = makeId(10);
            // 이미지명 + .png
            // 프론트에서 file 생성 해주었음
            callback(null, name + path.extname(file.originalname));
        },
    }),
    fileFilter: (_, file: any, callback: FileFilterCallback) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        } else {
            callback(new Error("이미지가 아닙니다."));
        }
    },
});


const router = Router();

// '/'주소로 req 들어올 시 userMiddleware와 authMiddleware 호출 후 createCommunity 핸들러가 호출됨
router.post("/", userMiddleware, authMiddleware, createCommunity);
// 비회원 user들도 커뮤니티 페이지 접근 가능
router.get("/community/topCommunities", topCommunities);
// authMiddleware는 왜 x?
router.get("/:name", userMiddleware, getCommunity);

router.post(
    "/:name/upload",
    userMiddleware,
    authMiddleware,
    myCommunity,
    upload.single("file"),
    uploadSubImage
  );
export default router;