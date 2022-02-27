// import React from 'react'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
const NewPassword = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const submitHandler = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Password and confirm password are not match');
        } else {
            const res = await axios.put('/api/users/upadtePassword/now', { email: email, password: password })
            if (res.data.msg == "Password updated Successfully") {
                setMsg('Password updated Successfully')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
            } else {
                setError('Invalid email address')
            }
        }
    };
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Enter New Password</h1>
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
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Confirm password</label>
                    <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Enter confirm password'
                        required
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label />
                    <button className='primary' type='submit'>
                        Reset Password
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

export default NewPassword