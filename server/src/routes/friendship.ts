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
 
  let friend_id = req.params.receiver_id; 

  if (user.id === parseInt(friend_id)) return res.status(409).json({ message: '스스로에게 친구 요청을 할 수 없어요.' });
/*
  const notExistUser = await AppDataSource.createQueryBuilder()
    .select("id")
    .from(User,"u")
    .execute()

  if (notExistUser.length === 0) return res.status(404).json({ message: '존재하지 않는 사용자예요.' }); */

  try {
    // 1. 나에게 요청을 보낸 적 없는 친구에게 내가 요청을 보내는 상황 혹은 
    // 2. 이미 나에게 요청을 보낸 친구에게 다시 요청을 보내는 상황
    const friendRequest = await FriendShip.find({
    
      where: [{    
          receiver_id: parseInt(friend_id), 
          sender_id: user.id
        },{
          receiver_id: user.id, 
          sender_id: parseInt(friend_id)
        }
      ]
    })
    
    // friendRequest의 type은 array
    if (friendRequest.length === 0) {
   
    // 엔티티에 등록(인스턴스 생성)!!!
    const friendship = new FriendShip();
    friendship.sender_id = user.id;
    // friend_id는 params에서 받아온 것이기 때문에 type: string
    friendship.receiver_id = parseInt(friend_id);
    friendship.accepted= false;
    // 친구요청에 대한 정보를 렌더링해야하기 때문에 본인의 id를 넣어주어야 한다.
    friendship.user_id = user.id;
   
    // database에 저장
    await friendship.save();
    return res.status(201).json({ message: '친구 요청을 보냈어요.' });
    }
    // 이 구문을 if문보다 먼저 선언해버리면 length가 0일때 error이기 떄문에 if문이 끝나고 선언해주어야 한다.
    // 친구요청 한개에 대한 정보이므로 length는 1이다.
    const { sender_id, receiver_id, accepted } = friendRequest[0];
    // friendRequest [{ sender_id: user_id, receiver_id: friend_id, accepted: true/false }]
    // 내가 이미 이전에 요청을 보냈던 친구에게 다시 요청을 보낼때
    if (friendRequest && sender_id === user.id && receiver_id === parseInt(friend_id) && accepted === false) return res.status(409).json({ message: '이미 친구 요청을 보냈어요.' });
    if (friendRequest && accepted === true) return res.status(409).json({ message: '이미 친구예요.' });
    // 이미 나에게 요청을 보냈던 친구에게 요청을 보낼때
    if (friendRequest && sender_id === parseInt(friend_id) && receiver_id === user.id && accepted === false) {
      
        const alFriendRequest = await FriendShip.findOneBy(
          {
                sender_id : parseInt(friend_id),
                receiver_id: user.id,
                accepted: false
          }
        )
      
        alFriendRequest.accepted = true;
        await FriendShip.save(alFriendRequest);
        return res.status(409).json({ message: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
    }
    
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
    
    const friendRequest = await FriendShip.findOneBy(
    {
            receiver_id: user.id,
            accepted: false
    }
    )
    
      // friendRequest는 object
      // 수락버튼 누르면 true로 변경
      friendRequest.accepted = true;
      // 새로운 인스턴스가 생성되는 것이 아니라 업데이트 시켜준다
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


  const getFriendsRequest = async(req: Request, res: Response) => {
    const user: User = res.locals.user;
   
  try {
    
    const friendRequest = await FriendShip.find({
      
      // accepted: false 해주어야 수락/거부 과정 진행된 친구들이 프론트에서 렌더링 안된다.
      where: {
          
          receiver_id: user.id, accepted: false
        }
      
    })
  
    // ★★★동기적 프로그래밍으로 인해 코드 위치 중요
    if(friendRequest.length === 0){
      return res.status(404).json({ message: '전달받은 친구요청이 없어요' })
    }
    // else문
    // friendRequest[0] 만 받으면 첫번째 요청만 프론트에 전송해주기 때문에 X
  
    
    // 친구요청을 보낸 친구들의 정보를 프론트에서 렌더링하기 위해
    // friendship 엔티티와 join을 해서 받은사람이 본인(보낸사람은 당연히 다른 유저들)이고 아직 수락하지 않았을때의 유저 정보 프론트에 전송
    const friends = await User.find({
      relations: {
        friendship: true
      }
      ,
      where: {
        // 받은 유저가 본인일때
        friendship: {
          receiver_id: user.id,
          accepted: false
        }
     
    }})
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
  
  

// get보다 post/put 핸들러 먼저 생성하기(친구요청 관련 핸들러 먼저 생성 후 친구 목록 불러오기 핸들러 생성해주어야함)
// 위에서 친구요청이 진행되었으므로 sender_id와 receiver_id에 이미 해당 유저의 index가 들어있다.
// 그러므로 친구정보를 불러오기 위해서는 join을 해서 친구의 id(인덱스), 친구의 아이디, 이름 등을 선택하여 프론트에 보낼 수 있다.
// (★친구의 아이디, 이름등이 저장되어 있는 엔티티가 따로 있는 것이 아니라 join과 조건을 통해 user엔티티에서 친구의 정보를 불러와야함(FK 논리)!)
const getFriendsList = async(req: Request, res: Response) => {
  const user: User = res.locals.user;
  try {
    const friendsList = await FriendShip.find({
    
      // {,} >> & 조건 
      // [,] >> or 조건
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



    

const router = Router();



router.put('/send/:receiver_id', userMiddleware, sendFriendRequest);
router.patch('/accept/:sender_id', userMiddleware, acceptFriendRequest); 
router.delete('/accept/:friend_id', userMiddleware, removeFriend);
router.get('/', userMiddleware, getFriendsList);
router.get('/request', userMiddleware, getFriendsRequest);
export default router;

