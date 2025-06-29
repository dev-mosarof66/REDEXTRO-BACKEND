import express from 'express';
import cors from 'cors'; // if using ES modules
import cookieParser from 'cookie-parser';



const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(cookieParser());



// Routes
import planRoutes from './routes/plan.routes.js';
import userRoutes from './routes/user.routes.js';


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/plans', planRoutes);

export default app
