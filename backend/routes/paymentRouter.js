import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
const paymentRouter = express.Router();

paymentRouter.post('/checkout', expressAsyncHandler(async (req, res) => {
    const instance = new Razorpay({
        key_id: 'rzp_test_tyFSxss7FIhKTo',
        key_secret: 'TvpPt3sA6TmnCThyjjroatNJ'
    })
    const options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: 1
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json(order)
        }
    });
}));

paymentRouter.post('/pay', expressAsyncHandler(async (req, res) => {
    const generated_signature = crypto.createHmac('sha256', keysecret)
    generated_signature.update(req.body.razorpay_order_id + "|" + req.body.transactionid)
    if (generated_signature.digest('hex') === req.body.razorpay_signature) {
        const transaction = new Transaction({
            transactionid: req.body.transactionid,
            transactionamount: req.body.transactionamount,
        });
        transaction.save(function (err, savedtransac) {
            if (err) {
                console.log(err);
                return res.status(500).send("Some Problem Occured");
            }
            res.send({ transaction: savedtransac });
        });
    }
    else {
        return res.send('failed');
    }
}))

export default paymentRouter;