import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Post from "../entities/Post";
import Community from "../entities/Community";
import Comment from "../entities/Comment";


const createPost = async (req: Request, res: Response) => {
    const { title, body, community } = req.body;
    if (title.trim() === "") {
        return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
    }
    
    const user = res.locals.user;
    // 데이터베이스에 저장
    try {
        const communityRecord = await Community.findOneByOrFail({ name: community });
        const post = new Post();
        post.title = title;
        post.body = body;
        post.user = user;
        post.community = communityRecord;

        await post.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
};

const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    try {
        const post = await Post.findOneOrFail({
            where: { identifier, slug },
            relations: ["community", "votes"],
        });

        // Post Entity에서 생성
        if (res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        return res.send(post);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
};

const createPostComment = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    // req.body{ body: newComment }
    const body = req.body.body;
    try {
        // identifier, slug가 동일한 post 찾기
        const post = await Post.findOneByOrFail({ identifier, slug });
        const comment = new Comment();
        comment.body = body;
        comment.user = res.locals.user;
        comment.post = post;

        if (res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        await comment.save();
        return res.json(comment);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }

}


const router = Router();
// 포스트 생성 api
router.post("/", userMiddleware, authMiddleware, createPost);
router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/:identifier/:slug/comments", userMiddleware, createPostComment);
export default router;
