import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listSellerRequest } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function SellerRequestListScreen(props) {
    const userSignIn = useSelector(state => state.userSignIn);
    const { userInfo } = userSignIn;

    const listSellerRequestDetails = useSelector(state => state.listSellerRequestDetails)
    const { loading, error, requests } = listSellerRequestDetails;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listSellerRequest())
    }, [])
    return (

        <div>
            <h1>Seller Requests</h1>
            {loading ? (
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
                        {requests.map(request => (
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
                                        onClick={() => {
                                            props.history.push(`/request/${request._id}`);
                                        }}
                                    >
                                        Approve
                                    </button>
                                    {userInfo.isAdmin && (
                                        <button
                                            type='button'
                                            className='small'
                                        // onClick={() => deleteHandler(request)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
        </div >
    )
}

export default SellerRequestListScreen
