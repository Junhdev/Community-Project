import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import Alarm from "../entities/Alarm";





const getAlarm = async(req: Request, res: Response) => {

  const { userID } = req.body;
  try {
    const alarms = await AppDataSource.createQueryBuilder()
  .select(
    `type, userID as "publisherId", content as "title"`
    )
.from(Alarm, "a")
.innerJoin(User, "u", `u.id = a.publisher_id`) 
.where("status = false")
.orderBy(`a.id`, "DESC")
.execute()
return res.status(200).json(alarms);
    
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
};

const router = Router();




router.get('/', userMiddleware, getAlarm);

export default router;
