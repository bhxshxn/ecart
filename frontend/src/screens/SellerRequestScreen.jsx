import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sellerRequest } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function SellerRequest(props) {
    const [pt, setPT] = useState('');
    const [reason, setReason] = useState('');

    const userSignIn = useSelector(state => state.userSignIn);
    const { userInfo } = userSignIn;
    const sellerRequestDetails = useSelector(state => state.sellerRequestDetails);
    const { loading, error, data } = sellerRequestDetails;
    console.log(data)
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(sellerRequest({ pt, reason }));
        setPT("");
        setReason("");
    };
    return (
        <div>
            <form className='form' onSubmit={submitHandler} >
                <div>
                    <h1>Become a Seller</h1>
                </div>
                {/* {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : ( */}
                {/* <> */}
                {loading && <LoadingBox />}
                {error && <MessageBox variant='danger'>{error}</MessageBox>}
                {data && (
                    <MessageBox variant='success'>{data.message}</MessageBox>
                )}
                <div>
                    <label htmlFor='name'>Product Type</label>
                    <input
                        id='name'
                        type='text'
                        placeholder='Enter product type'
                        value={pt}
                        onChange={e => setPT(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor='price'>Reason</label>
                    <input
                        id='price'
                        type='text'
                        placeholder='Enter your reason to become a seller'
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label />
                    <button className='primary' type='submit'>
                        Send Request
                    </button>
                </div>
                <div>
                    <label />
                    <button
                        className='primary'
                        onClick={() => props.history.push('/productlist')}
                    >
                        Back
                    </button>
                </div>
                {/* </> */}
                {/* )} */}
            </form>
        </div>
    )
}

export default SellerRequest
