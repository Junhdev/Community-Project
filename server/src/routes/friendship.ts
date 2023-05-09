import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import FriendShip from "../entities/FriendShip";

// id가 인덱스
// userID가 유저아이디

// 현재유저 A
// A유저가 B유저에게 친구요청을 보냈을때, B유저의 id(인덱스)가 friendship 엔티티의 receiver_id(인덱스)로 들어가고(즉, 테이블에서 B.id와 f.receiver_id가 같아지고), A유저의 id(인덱스)가 sender_id(인덱스)로 들어간다.(즉, 테이블에서 A.id와 f.sender_id가 같아진다)

const sendFriendRequest = async(req: Request, res: Response) => {
  const user: User = res.locals.user;
 
  const friend_id = req.params.receiver_id; 

  if (user.id === parseInt(friend_id)) return res.status(409).json({ message: '스스로에게 친구 요청을 할 수 없어요.' });

  const notExistUser = await AppDataSource.createQueryBuilder()
    .select("id")
    .from(User,"u")
    .execute()

  if (notExistUser.length === 0) return res.status(404).json({ message: '존재하지 않는 사용자예요.' });

  try {
    const friendRequest = await FriendShip.find({
    
      
      where: {
       
          receiver_id: parseInt(friend_id)
        }
      
    })
    const { sender_id, receiver_id, accepted } = friendRequest[0];
    if (receiver_id === parseInt(friend_id) && user.id === sender_id) return res.status(409).json({ message: '이미 친구 요청을 보냈어요.' });
    
    // friendRequest의 type은 array
    if (friendRequest.length !== 0) {
      /*
      await AppDataSource.createQueryBuilder()
    .insert()
    .into(FriendShip)
    .values({sender_idx?: ,  })
    .execute()
    */

    
        
    const friendship = new FriendShip();
    friendship.sender_id = user.id;
    // friend_id는 params에서 받아온 것이기 때문에 type: string
    friendship.receiver_id = parseInt(friend_id);
    friendship.accepted= false;
    friendship.user_id = parseInt(friend_id);
   
    
    // database에 저장
    await friendship.save();
    
      return res.status(201).json({ message: '친구 요청을 보냈어요.' });
    }

    // friendRequest [{ sender_id: user_id, receiver_id: friend_id, accepted: true/false }]
    //const { sender_id, receiver_id, accepted } = friendRequest[0];
    //if (receiver_id === parseInt(friend_id)) return res.status(409).json({ message: '이미 친구 요청을 보냈어요.' });
    if (accepted) return res.status(409).json({ message: '이미 친구예요.' });
   
    
    return res.status(200).json({ message: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
  } catch {
    return res.status(500).json({ message: '서버 에러가 발생했어요.' });
  }
};

// 현재유저 A
// A유저가 B유저에게 친구요청 받았을 때
// A유저가 B유저에게 친구요청을 보냈을때, B유저의 id(인덱스)가 friendship 엔티티의 receiver_id(인덱스)로 들어가고(즉, 테이블에서 B.id와 f.receiver_id가 같아지고), A유저의 id(인덱스)가 sender_id(인덱스)로 들어간다.(즉, 테이블에서 A.id와 f.sender_id가 같아진다)

const acceptFriendRequest = async(req: Request, res: Response) => {
  // 체크
  const user: User = res.locals.user
  // 보낸 사람의 인덱스 = 친구의 인덱스
  const friend_id = req.params.sender_id;
  try {
    
    const friendRequest = await FriendShip.findOneBy({
    
      
     
          
          
            receiver_id: user.id,
            accepted: false
        
      
    })
    
      // friendRequest는 object
      friendRequest.accepted = true;
      await FriendShip.save(friendRequest);
      return res.status(200).json({ message: '친구가 되었어요.' });
      

    }
    
   
   
  
   

    //if (affectedRows === 0) return res.status(404).json({ message: '존재하지 않는 친구 요청이에요.' });
    
  catch {
    return res.status(500).json({ message: '서버 에러가 발생했어요.' });
  }
};

const removeFriend =  async(req: Request, res: Response) => {

  try {
    const { affectedRows } : any = await AppDataSource.createQueryBuilder()
    .delete()
    .from(FriendShip)
    .where("accepted = true")
    .execute()
   
    if (affectedRows === 0) return res.status(404).json({ message: '존재하지 않는 친구예요.' });
    return res.status(200).json({ message: '친구가 삭제되었어요.' });
  } catch {
    return res.status(500).json({ message: '서버 에러가 발생했어요.' });
  }
  }


// get보다 post/put 핸들러 먼저 생성하기(친구요청 관련 핸들러 먼저 생성 후 친구 목록 불러오기 핸들러 생성해주어야함)
// 위에서 친구요청이 진행되었으므로 sender_id와 receiver_id에 이미 해당 유저의 index가 들어있다.
// 그러므로 친구정보를 불러오기 위해서는 join을 해서 친구의 id(인덱스), 친구의 아이디, 이름 등을 선택하여 프론트에 보낼 수 있다.
// (★친구의 아이디, 이름등이 저장되어 있는 엔티티가 따로 있는 것이 아니라 join과 조건을 통해 user엔티티에서 친구의 정보를 불러와야함(FK 논리)!)
const getFriendsList = async(req: Request, res: Response) => {
  const user: User = res.locals.user;
  try {
    const friendsList = await FriendShip.find({
    
      
      where: [
        { receiver_id: user.id, accepted: true },
        { sender_id: user.id, accepted: true }
      ]
      
    })

    
      return res.json(friendsList);

      /*
    const friends = await AppDataSource.createQueryBuilder()
    .select(
          `u.id, u.userID , u.username, u.profileImg`
          )
      .from(User, "u")
      .leftJoin(FriendShip, "f", `(u.id = f.sender_id) or (u.id = f.receiver_id)`)
      .where(`accepted = true`)
      .execute()
    return res.json(friends);
    */
  } catch {
    return res.status(500).json({ message: '서버 에러가 발생했어요.' });
  }
}

const getFriendsRequest = async(req: Request, res: Response) => {
  const user: User = res.locals.user;
 
try {
  
  const friendRequest = await FriendShip.find({
    
    // accepted: false 해주어야 수락/거부 과정 진행된 친구들이 프론트에서 렌더링 안된다.
    where: {
        
        receiver_id: user.id
      }
    
  })
  const { sender_id, receiver_id, accepted } = friendRequest[0];
  let friend_id;
  if (accepted === false) {
    friend_id = sender_id;
  }
  if(friendRequest.length === 0){
    return res.status(404).json({ message: '전달받은 친구요청이 없어요' })
  }
  // id가 friend_id인 유저 찾기
  const friends = await User.find({
    
    
    where: {
      id: friend_id
    }
   
  })
    return res.json(friends);
  
  /*
  const friends = await AppDataSource.createQueryBuilder()
  .select(
    `u.id, u.userID , u.username, u.profileImg`
    )
.from(User, "u")
.leftJoin(FriendShip, "f", `f.receiver_id = u.id`)
.where("accepted = false")
.execute()
return res.json(friends);
  */

} catch {
  return res.status(500).json({ message: '서버 에러가 발생했어요.' });
}
};
  

    

const router = Router();



router.put('/send/:receiver_id', userMiddleware, sendFriendRequest);
router.patch('/accept/:sender_id', userMiddleware, acceptFriendRequest); 
router.delete('/:friend_id', userMiddleware, removeFriend);
router.get('/', userMiddleware, getFriendsList);
router.get('/request', userMiddleware, getFriendsRequest);
export default router;

