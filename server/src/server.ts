const express = require('express');
import cors from 'cors';
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from './routes/auth';
import communityRoutes from './routes/community';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

// 서로 다른 ORIGIN에서 cookie에 token 저장을 위해 백엔드에서 credentials: true 설정 필요
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}))

/* for body-parsing application/json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* HTTP 요청에 대한 log를 남겨주는 미들웨어 */
app.use(morgan('dev'));
app.use(cookieParser());

dotenv.config();

app.get("/", (_, res) => res.send("running"));
// 라우터 사용
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);


app.use(express.static("public"));


let port = 4000;
app.listen(port, async () => {
    console.log('server running at http://localhost:4000');

    AppDataSource.initialize().then(() => {
        console.log("database initialized");
    }).catch(error => console.log(error))
})
