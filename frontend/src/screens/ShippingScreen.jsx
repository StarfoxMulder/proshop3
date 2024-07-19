import { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  // Destructuring shippingAddress from cart state for conditional field pop
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [ address, setAddress ] = useState(shippingAddress?.address || '');
  const [ city, setCity ] = useState(shippingAddress?.city || '');
  const [ postal, setPostal ] = useState(shippingAddress?.postal || '');
  const [ country, setCountry ] = useState(shippingAddress?.country || '');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    // saveShippingAddress is looking for state.shippingAddress
    dispatch(saveShippingAddress({ address, city, postal, country }));
    navigate('/payment');
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      
      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postal' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Postal Code'
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='my-2'
        >Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
