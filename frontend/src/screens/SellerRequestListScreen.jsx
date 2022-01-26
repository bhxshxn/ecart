import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, listSellerRequest, updatedUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Axios from 'axios';

function SellerRequestListScreen(props) {
    const userSignIn = useSelector(state => state.userSignIn);
    const { userInfo } = userSignIn;

    const userDetails = useSelector(state => state.userDetails);
    const { user } = userDetails;

    const listSellerRequestDetails = useSelector(state => state.listSellerRequestDetails)
    const { loading, error, requests } = listSellerRequestDetails;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listSellerRequest())
    }, [])

    const approveHandler = async (userId, reqId) => {
        const { data } = await Axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if (data) {
            dispatch(updatedUser({ _id: data._id, name: data.name, email: data.email, isSeller: true, isAdmin: data.isAdmin }))
            await Axios.delete(`/api/users/RequestSellerDelete/${reqId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }).then(response => {
                alert("Request Approved");
                dispatch(listSellerRequest())
            })
        }

    }
    const rejectHandler = async (id) => {
        var answer = window.confirm("Are you sure to reject the Request?");
        if (answer) {
            await Axios.delete(`/api/users/RequestSellerDelete/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }).then(response => {
                dispatch(listSellerRequest())
            }).catch(error => { console.log(error) })
        }
        else {
            console.log('no')
        }

    }

    return (
        <div  >
            <h1>Seller Requests</h1>
            {
                loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Product Type</th>
                                <th>Reason</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests && requests.map(request => (
                                <tr key={request._id}>
                                    <td>{request._id}</td>
                                    <td>{request.user === null ? 'No name' : request.user}</td>
                                    <td>{request.productType}</td>
                                    <td>
                                        {request.reason}
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className='small'
                                            onClick={() => approveHandler(request.user, request._id)}
                                        >
                                            Approve
                                        </button>
                                        {userInfo.isAdmin && (
                                            <button
                                                type='button'
                                                className='small'
                                                onClick={() => rejectHandler(request._id)}
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default SellerRequestListScreen
