import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Friend } from "../entities/Friend";

// id가 인덱스
// userID가 유저아이디

// 현재유저 A
// A유저가 B유저에게 친구요청을 보냈을때, B유저의 id(인덱스)가 friendship 엔티티의 receiver_id(인덱스)로 들어가고(즉, 테이블에서 B.id와 f.receiver_id가 같아지고), A유저의 id(인덱스)가 sender_id(인덱스)로 들어간다.(즉, 테이블에서 A.id와 f.sender_id가 같아진다)

const postFreindRequest = async(req: Request, res: Response) => {
  const { userIdx } = req.body;
  const friendIdx = req.params.userIdx; // 체크

  if (userIdx === parseInt(friendIdx)) return res.status(409).json({ msg: '스스로에게 친구 요청을 할 수 없어요.' });

  const notExistUser = await AppDataSource.createQueryBuilder()
    .select("id")
    .from(User,"u")
    .where("id = ?")
    .execute()

  if (notExistUser.length === 0) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

  try {
    const friendRequest = await AppDataSource.createQueryBuilder()
    .select("*")
    .from(Friend,"f")
    .where(" (sender_idx = ? and receiver_idx = ?) ")
    .execute()
   

    if (friendRequest.length === 0) {
      await AppDataSource.createQueryBuilder()
    .insert()
    .into(Friend)
    .values({sender_idx?: ,  })
    .execute()

    const user: User = res.locals.user;
        
    const friend = new Friend();
    friend.sender_idx = userIdx;
    friend.receiver_idx = ;
    friend.accepted= false;
   
    
    // database에 저장
    await friend.save();
      return res.status(201).json({ msg: '친구 요청을 보냈어요.' });
    }

    const { sender_idx: senderIdx, accepted } = friendRequest[0];

    if (accepted) return res.status(409).json({ msg: '이미 친구예요.' });
    if (senderIdx === userIdx) return res.status(409).json({ msg: '이미 친구 요청을 보냈어요.' });

    await executeSql('update friendship set accepted = true where sender_idx = ? and receiver_idx = ?', [friendIdx, userIdx]);
    return res.status(200).json({ msg: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
};

// 현재유저 A
// A유저가 B유저에게 친구요청 받았을 때
// A유저가 B유저에게 친구요청을 보냈을때, B유저의 id(인덱스)가 friendship 엔티티의 receiver_id(인덱스)로 들어가고(즉, 테이블에서 B.id와 f.receiver_id가 같아지고), A유저의 id(인덱스)가 sender_id(인덱스)로 들어간다.(즉, 테이블에서 A.id와 f.sender_id가 같아진다)

router.patch('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('update friendship set accepted = true where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx, friendIdx])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.status(200).json({ msg: '친구가 되었어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.delete('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('delete from friendship where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx, friendIdx])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.status(200).json({ msg: '친구 요청을 거절했어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

// get보다 post/put 핸들러 먼저 생성하기(친구요청 관련 핸들러 먼저 생성 후 친구 목록 불러오기 핸들러 생성해주어야함)
// 위에서 친구요청이 진행되었으므로 sender_id와 receiver_id에 이미 해당 유저의 index가 들어있다.
// 그러므로 친구정보를 불러오기 위해서는 join을 해서 친구의 id(인덱스), 친구의 아이디, 이름 등을 선택하여 프론트에 보낼 수 있다.
// (★친구의 아이디, 이름등이 저장되어 있는 엔티티가 따로 있는 것이 아니라 join과 조건을 통해 user엔티티에서 친구의 정보를 불러와야함!)
const getFriendsList = async(req: Request, res: Response) => {
  //const {idx} = req.body.idx;
  try {
    const users = await AppDataSource.createQueryBuilder()
    .select(
          "id, userId , username, profileImg"
          )
      .from(User, "u")
      .innerJoin(Friend, "f", `(u.id = f.sender_idx) or (u.id = f.receiver_idx)`)
      .where(`u.id != ? and (f.receiver_idx = ? or sender_idx = ?) and accepted = true`)
      .execute()
    return res.json(users);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
}

const getFriendsRequest = async(req: Request, res: Response) => {
//const { userId } = req.user;
try {
  const users = await AppDataSource.createQueryBuilder()
  .select(
    "idx, userId , username, profileImg"
    )
.from(User, "u")
.innerJoin(Friend, "f", `u.id = f.sender_idx`)
.where(`(f.receiver_idx = ?) and (accepted = false)`)
.execute()
return res.json(users);
  
} catch {
  res.status(500).json({ msg: '서버 에러가 발생했어요.' });
}
};
  
const removeFriend =  async(req: Request, res: Response) => {
//const { userIdx } = req.user;
//const friendIdx = req.params.idx;
try {
  const { affectedRows } : any = await AppDataSource.createQueryBuilder()
  .delete()
  .from(Friend)
  .where("(sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?) and accepted = true")
  .execute()
 
  if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구예요.' });
  res.status(200).json({ msg: '친구가 삭제되었어요.' });
} catch {
  res.status(500).json({ msg: '서버 에러가 발생했어요.' });
}
}
    

const router = Router();


router.delete('/:userIdx', userMiddleware, removeFriend);
router.put('/request/:userIdx', userMiddleware, postFreindRequest);
router.get('/', userMiddleware, getFriendsList);
router.get('/request', userMiddleware, getFriendsRequest);
export default router;

