import multer from 'multer';
import express from 'express'
// import config from '../config';
import { isAuth } from '../utils.js';
// console.log(config.accessKeyId);
const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});



export default uploadRouter;