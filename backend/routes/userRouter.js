import express, { response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

import data from '../data.js';
import User from '../models/userModel.js';
import sellerRequest from '../models/sellerRequestModel.js'
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
})
);
userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);
    res.send(topSellers);
  })
);
userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    try {
      const createdUsers = await User.insertMany(data.users);
      res.send({ createdUsers });
    } catch (error) {
      console.log(error);
      res.status(512).send(error.message);
    }
  })
);
userRouter.post('/resetPassword', async (req, res) => {
  const result = await User.find({ email: req.body.email });
  if (result.length != 0) {
    console.log('wokr')
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'yash.lioneyeinfotech9@gmail.com',
        pass: 'Yash@987'
      }
    }));

    var mailOptions = {
      from: 'yash.lioneyeinfotech9@gmail.com',
      to: req.body.email,
      subject: 'Reset Request',
      text: `Click link to reset you password
            http://localhost:3000/newPassword/834yjsfo03r8jfejkdsfolksfjuo`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.send({ msg: "Link sent Successfully" })
  } else (
    res.send({ msg: "Enter a Valid email" })
  )
});
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    // await User.deleteMany({});
    const user = await User.findOne({ email: req.body.email });
    try {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(user),
          });
        } else {
          res.status(401).send({ message: 'Invalid email and password' })
        }
      } else {
        res.status(401).send({ message: 'Invalid email and password' })
      }
    } catch (error) {
      console.log(error);
      res.status(512).send(error.message);
    }
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      seller: { name: req.body.name, email: req.body.email }
    });
    try {
      const createdUser = await user.save();
      const { _id, name, email, isAdmin, isSeller } = createdUser
      res.send({
        _id,
        name,
        email,
        isAdmin,
        isSeller,
        token: generateToken(createdUser),
      });
    } catch (error) {
      res.status(512).send({ message: 'Email already exist' })
    }

  })
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin === true) {
      res.status(400).send({ message: 'Cannot Delete Admin User' })
      return;
    }
    const deletedUser = await user.remove();
    res.status(201).send({ message: 'User deletedUser', user: deletedUser })
  } else {
    res.status(404).send({
      message: "User Not found "
    })
  }
}))

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isSeller = req.body.isSeller;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.status(201).send({
      message: 'User updated successfully', user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        token: generateToken(updatedUser)
      }
    });
  } else {
    res.status(404).send({ message: "User Not found" });
  }
}))

userRouter.post(
  '/sellerRequest', isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("req.body")
    const LatestsellerRequest = new sellerRequest({
      productType: req.body.data.pt,
      reason: req.body.data.reason,
      user: req.body.userInfo._id
    });
    try {
      await LatestsellerRequest.save().then(response => {
        if (response) {
          res.status(201).send({ message: "Request Submitted Successfully" });
        } else {
          res.status(512).send({ message: "Request Failed to Submit" });
        }
      })
    } catch (error) {
      res.status(512).send({ message: "Request Failed to Submit" });
    }
  })
);

userRouter.get('/sellerRequest/:id', expressAsyncHandler(async (req, res) => {
  await sellerRequest.find({ user: req.params.id }).then((result) => {
    res.send(result)
  }).catch((error) => {
    console.log(error)
  })
}));

userRouter.get('/RequestSeller/List', expressAsyncHandler(async (req, res) => {
  await sellerRequest.find({}).then(result => {
    res.setHeader('content-type', 'text/json');
    res.send(result)
  }).catch(error => console.log(error))
}));

userRouter.delete('/RequestSellerDelete/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  await sellerRequest.findByIdAndDelete(req.params.id).then(response => {
    console.log(response)
    if (response) {
      res.status(201).send({ msg: 'Request Rejected' });
    } else {
      res.status(512).send({ msg: 'Cannot delet Request' });
    }
  }).catch(error => {
    console.log(error)
    res.status(512).send({ msg: 'Cannot delet Request' });
  })
}));

userRouter.put('/upadtePassword/now', async (req, res) => {
  // console.log(req.body)
  const result = await User.findOneAndUpdate({ email: req.body.email }, { password: bcrypt.hashSync(req.body.password, 8) })
  if (result.length != 0) {
    res.send({ msg: "Password updated Successfully" })
  } else (
    res.send({ msg: "Enter a Valid email" })
  )
})
export default userRouter;