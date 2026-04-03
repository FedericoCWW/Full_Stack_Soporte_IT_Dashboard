import express, { NextFunction, Request, Response } from "express";
import router from './routes/tickets'
import cors from 'cors'

const app = express();
const port = 3000;
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json());

app.use('/api/tickets', router)

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send("Algo salió mal");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
