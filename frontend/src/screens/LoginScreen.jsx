import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from "../components/FormContainer"
import Loader from "../components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  // Getting userInfo from the state
  const { userInfo } = useSelector((state) => state.auth)

  // If there's a redirect param in the URL (such as /shipping in the CartScreen)
  // Redirect them to that location or the main page after login
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.trace();
    console.log(e);
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error);
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
          type='email'
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
          type='password'
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          onClick={submitHandler}
          disabled={ isLoading }
        >
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
        New customer?{' '}
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
        Register
        </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen