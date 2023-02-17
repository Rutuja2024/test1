import express , {json} from 'express';
import cors from 'cors';
import dotenv from "dotenv/config";
import cookieParser from 'cookie-parser';
import {dirname , join} from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import answerRouter from './routes/answers-routes.js';
import questionRouter from './routes/questions-routes.js';
import resultRouter from './routes/results-routes.js';

// dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true , origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use('/',express.static(join(__dirname,'public')));


app.use('/api/users',usersRouter);
app.use('/api/auth',authRouter );
app.use('/quiz/questions', questionRouter);
app.use('/quiz/answers', answerRouter);
app.use('/quiz/results', resultRouter);


app.listen(PORT, ()=>console.log(`Server is listning on ${PORT}`));



//http://localhost:5000/api/users