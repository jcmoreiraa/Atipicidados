import express from 'express';
import { userRouter } from './routes/routes'; 
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path'; 

const port = Number(process.env.PORT) || 3002;
const host = process.env.HOST || '0.0.0.0';

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*', 
    credentials: true 
}));
app.use(cookieParser());

app.use('/imagens', express.static('uploads/'));

app.use(userRouter);

app.listen(port, host, () => {
    console.log(Servidor rodando em http://${host}:${port});
});
