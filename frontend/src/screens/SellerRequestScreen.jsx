import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sellerRequest } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios';

function SellerRequest(props) {
    const [pt, setPT] = useState('');
    const [reason, setReason] = useState('');
    const [exist, setExist] = useState(true)

    const userSignIn = useSelector(state => state.userSignIn);
    const { userInfo } = userSignIn;
    const sellerRequestDetails = useSelector(state => state.sellerRequestDetails);
    const { loading, error, data } = sellerRequestDetails;
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(sellerRequest({ pt, reason }));
        setPT("");
        setReason("");
    };
    useEffect(async () => {
        await axios.get(`/api/users/sellerRequest/${userInfo._id}`).then((response) => {
            if (response.data.length != 0) {
                setExist(true)
            } else {
                setExist(false)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const msgStyle = {
        display: 'flex',
        height: '60vh',
        width: '95vw',
        alignItems: 'center',
        justifyContent: 'center'
    }
    return (
        <div>
            {exist && <MessageBox variant='success' style={msgStyle}>Request Already Exists</MessageBox> ||
                <form className='form' onSubmit={submitHandler} >

                    <div>
                        <h1>Become a Seller</h1>
                    </div>
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

                </form>}
        </div>
    )
}

export default SellerRequest
