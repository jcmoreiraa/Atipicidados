import { Router } from 'express';
import cors from 'cors';
import { createUserUnidade, addGerenteToUnidade} from '../controllers/unidadeContrellers';

export const unidadeRouter = Router();
unidadeRouter.use(cors());
unidadeRouter.post('/', createUserUnidade);
unidadeRouter.put('/connectgerente', addGerenteToUnidade);
