import { Router } from 'express';
import cors from 'cors';
import { createUserUnidade, addGerenteToUnidade, getUnidadeById, getUnidades} from '../controllers/unidadeControllers';

export const unidadeRouter = Router();
unidadeRouter.post('/', createUserUnidade);
unidadeRouter.put('/connectgerente', addGerenteToUnidade);
unidadeRouter.get('/getUnidadeById/:id', getUnidadeById);
unidadeRouter.get('/getall', getUnidades);
