const express = require('express');
import cors from 'cors';
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from './routes/auth';
import communityRoutes from './routes/communities';
import postRoutes from './routes/posts';
import likeRoutes from './routes/likes';
import userRoutes from './routes/users';
import friendRoutes from './routes/friends';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

// 서로 다른 ORIGIN에서 cookie에 token 저장을 위해 백엔드에서 credentials: true 설정 필요
const origin = process.env.ORIGIN;
app.use(cors({
    origin,
    credentials: true,
    optionsSuccessStatus: 200
}))

/* for body-parsing application/json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* HTTP 요청에 대한 log를 남겨주는 미들웨어 */
app.use(morgan('dev'));
app.use(cookieParser());


app.get("/", (_, res) => res.send("running"));
// 해당 경로로 접근하면 해당 Routes로 이동
app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);

// static파일을 public 파일 안에 있고 브라우저로 접근할 때 제공할 수 있게 해줌
app.use(express.static("public"));


let port = 4000;
app.listen(port, async () => {
    console.log(`server running at ${process.env.APP_URL}`);

    AppDataSource.initialize().then(() => {
        console.log("database initialized");
    }).catch(error => console.log(error))
})
