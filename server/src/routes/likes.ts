import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { User } from "../entities/User";
import Post from "../entities/Post";
import Like from "../entities/Like";
import Comment from "../entities/Comment";



const like = async (req:Request, res:Response) => {
    const { identifier, slug, commentIdentifier, value } = req.body;
    // -1 0 1의 value 만 오는지 체크
    if(![-1, 0 ,1].includes(value)) {
        return res.status(400).json({ value: "-1, 0, 1의 value만 올 수 있습니다."});
    }

    try {
        const user: User = res.locals.user;
        let post: Post = await Post.findOneByOrFail({ identifier, slug});
        let like: Like | undefined;
        let comment: Comment;

            if(commentIdentifier) {
                // 댓글 식별자가 있는 경우 댓글로 vote 찾기
                comment = await Comment.findOneByOrFail({ identifier: commentIdentifier});
                like = await Like.findOneBy({ username: user.username, commentId: comment.id});
            } else {
                // 포스트로 vote 찾기
                like = await Like.findOneBy({ username: user.username, postId: post.id});
            }

            if(!like && value === 0 ) {
                // like이 없고 value가 0인 경우 오류 반환
                return res.status(404).json({ error: "Vote을 찾을 수 없습니다."});
            } else if( !like) {
                like = new Like();
                like.user = user;
                like.value = value;

                // 게시물에 속한 like or 댓글에 속한 like
                if(comment) like.comment = comment
                else like.post = post;
                await like.save();
            } else if(value === 0) {
                like.remove();
            } else if ( like.value !== value) {
                like.value = value;
                await like.save();
            }

            post = await Post.findOneOrFail({
                where: {
                    identifier, slug
                }, 
                relations: ["comments", "comments.likes", "community", "likes"]
            })

            post.setUserLike(user);
            post.comments.forEach(c => c.setUserLike(user));

            return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다."})
    }
}




const router = Router();
router.post("/", userMiddleware, authMiddleware, like);
export default router;