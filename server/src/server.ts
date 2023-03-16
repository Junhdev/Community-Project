/* entry 파일 */
import express from "express";
import cors from 'cors';
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from './routes/auth';

const app = express();

const origin = process.env.ORIGIN;
app.use(cors({
    origin,
    credentials: true
}))


/* for body-parsing application/json */
app.use(express.json());
/* HTTP 요청에 대한 log를 남겨주는 미들웨어 */
app.use(morgan('dev'));

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);

let port = 4000;
app.listen(port, async () => {
    console.log('server running at http://localhost:${port}');

    AppDataSource.initialize().then(() => {
        console.log("database initialized");
    }).catch(error => console.log(error))
})
