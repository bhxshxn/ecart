import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import productRouter from './routes/productRouter.js'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import paymentRouter from './routes/paymentRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// mongodb+srv://interview_db:rockstar123@cluster0.9koh3.mongodb.net/interview_db?retryWrites=true&w=majority
const URL = "mongodb+srv://bhxshxn:bhxshxn@9@cluster0.ixoza.mongodb.net/yash-project?etryWrites=true&w=majority"
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log(`MongoDB is connected Successfully`);
}).catch((error) => {
  console.log(error.message);
});

app.use('/api/uploads', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is connected on http://localhost:${PORT}`);
});