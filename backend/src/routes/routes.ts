import {Router, Request, Response} from 'express';
import cors from 'cors'
import { gerentesRouter } from './gerentesRoutes';
import {unidadeRouter} from './unidadeRouter';
import {pacienteRouter} from './pacienteRouter';
import { colaboradorRouter } from './colaboradorRoutes';
import { ensureAuthenticated } from '../middleware/ensureAuthenticate.ts/autheticate';


export const userRouter = Router();
userRouter.use('/gerentes',gerentesRouter)
userRouter.use('/unidades', unidadeRouter)
userRouter.use('/pacientes', pacienteRouter)
userRouter.use('/colaboradores', colaboradorRouter)

// Health check endpoint
userRouter.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Demais rotas que faremos


userRouter.get('/', ensureAuthenticated, (req: Request, res: Response) => {
    res.send('Hello World');
});
userRouter.get('/server-time', (req, res) => {
    res.json({ serverTime: new Date().toISOString() });
  });