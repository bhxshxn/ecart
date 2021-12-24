import React from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { payOrder } from '../actions/orderActions';

function Payment(props) {
    const userSignIn = useSelector(state => state.userSignIn);
    const { userInfo } = userSignIn;
    const orderDetails = useSelector(state => state.orderDetails);
    const { loading, error, order } = orderDetails;
    const dispatch = useDispatch();

    console.log(props)
    const componentDidMount = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }
    const successPaymentHandler = paymentResult => {
        dispatch(payOrder(order, paymentResult));
    };
    const openPayModal = (amt) => {
        var amount = amt * 100; //Razorpay consider the amount in paise
        var options = {
            "key": process.env.REACT_APP_razorpaytest_id,
            "amount": "", // 2000 paise = INR 20, amount in paisa
            "name": "",
            "description": "",
            'order_id': "",
            "handler": function (response) {
                console.log(response);
                var values = {
                    razorpay_signature: response.razorpay_signature,
                    razorpay_order_id: response.razorpay_order_id,
                    transactionid: response.razorpay_payment_id,
                    transactionamount: amount,
                }
                axios.post('http://localhost:5000/api/payment/pay', values)
                    .then(res => { alert("Success") })
                    .catch(e => console.log(e))
                successPaymentHandler();
            },
            "prefill": {
                "name": props.name,
                "email": `${userInfo.email}`,
            },
            "notes": {
                "address": "Hello World"
            },
            "theme": {
                "color": "#528ff0"
            }
        };
        axios.post('http://localhost:5000/api/payment/checkout', { amount: amount })
            .then(res => {
                options.order_id = res.data.id
                options.name = props.name
                options.amount = res.data.amount;
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
            })
            .catch(e => console.log(e))

    };
    return (
        <div>
            <button className='primary block' onClick={(e) => { openPayModal(props.amount) }}>Pay</button>
        </div>
    )
}

export default Payment
