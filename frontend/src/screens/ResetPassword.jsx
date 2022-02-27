import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
const ResetPassword = props => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const submitHandler = async e => {
        e.preventDefault();
        const result = await axios.post('/api/users/resetPassword', { email: email })
        if (result.data.msg == "Link sent Successfully") {
            setMsg('Link sent Successfully')
        } else {
            setError('Invalid email address')
        }
    };
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Reset Password</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox varient='danger'>{error}</MessageBox>}
                {msg && <MessageBox varient='success'>{msg}</MessageBox>}

                <div>
                    <label htmlFor='email'>Email address</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter Email'
                        required
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label />
                    <button className='primary' type='submit'>
                        Send the Link
                    </button>
                </div>
                <div>
                    <label />
                    <div>
                        Already have an account? <Link to={`/signin`}>Sign In</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword