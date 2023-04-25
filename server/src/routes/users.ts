import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user";
import Post from "../entities/Post";
import Comment from "../entities/Comment";

const getUserData = async (req: Request, res: Response) => {
  try {
    // 유저 정보 가져오기
    const user = await User.findOneOrFail({
        where: { username: req.params.username },
        select: ["username", "createdAt"],
    });

    // 유저가 쓴 포스트 정보 가져오기
    const posts = await Post.find({
      where: { username: user.username },
      relations: ["comments", "likes", "community"],
    });

    // 유저가 쓴 댓글 정보 가져오기
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ["post"],
    });

    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach((p) => p.setUserLike(user));
      comments.forEach((c) => c.setUserLike(user));
    }

    let userData: any[] = [];

    // 새로운 객체에 복사를 할 때, 인스턴스 상태(현재, p와 C는 posts배열의 인스턴스 형식)로 하면 Entity에서 @Expose를 이용하여 만든 getter는 들어가지 않는다. 따라서 toJSON()으로 객체로 바꾼 후 복사해주어야 한다.
    posts.forEach((p) => userData.push({ type: "Post", ...p.toJSON() }));
    comments.forEach((c) => userData.push({ type: "Comment", ...c.toJSON() }));

    // 최신 정보가 먼저 오게 순서 정렬
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();
router.get("/:username", userMiddleware, getUserData);

export default router;