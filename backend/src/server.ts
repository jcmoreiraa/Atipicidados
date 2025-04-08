import express from 'express';
import { userRouter } from './routes/routes'; 
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path'; 

const port = Number(process.env.EXPRESS_PORT) || 3002;

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://atipicidades-ssks.vercel.app', 
    credentials: true 
}));
app.use(cookieParser());

app.use('/imagens', express.static('uploads/'));

app.use(userRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
