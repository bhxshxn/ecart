import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { signIn } from '../actions/userActions';

const SignInScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const userSignIn = useSelector(state => state.userSignIn);
  const { userInfo, loading, error } = userSignIn;

  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(signIn(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [userInfo, redirect, props.history]);

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        <div>
          {loading && <LoadingBox></LoadingBox>}
          {error && <MessageBox varient='danger'>{error}</MessageBox>}
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
          <label />
          <button className='primary' type='submit'>
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              New Customer ?{' '}
              <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
            </div>
            <div>
              Forgot Password ?{' '}
              <Link to={`/resetPassword`}>Reset Password</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInScreen;
