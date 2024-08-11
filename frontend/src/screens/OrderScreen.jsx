import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation
} from '../slices/ordersApiSlice'

const OrderScreen = () => {
  // Destructuring id url param, assign it to orderId
  const { id: orderId } = useParams();
  // Passing orderId into uGODQ, destructuring data for desired values
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  // Renaming default isLoading so that the state is reflective of this resolution
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // Renaming multiple destructured values
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal
   } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD'
          }
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }
      if (order && !order.isPaid) {
        // If there is an order that hasn't been paid and paypal has not been loaded, run loader
        if(!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    // PayPal will return payment details when complete; using these to mark payment on our backend
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch(); // Update UI to reflect payment made
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    });
  };

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch(); // Update UI to reflect payment made
    toast.success('Payment successful');
  };

  function onError(err) {
    toast.error(err.message)
  };

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice
          }
        }
      ]
    }).then((orderId) => {
      return orderId
    });
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err?.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong>{order.user.name}</p>
              <p><strong>Email: </strong>{order.user.email}</p>
              <p><strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city}
              {' '}{order.shippingAddress.postal} {order.shippingAddress.country}
              </p>
              { order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              ) }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method: </strong>{order.paymentMethod}</p>
              { order.isPaid ? (
                <Message variant='success'>
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              ) }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              { order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price }
                    </Col>
                  </Row>
                </ListGroup.Item>
              )) }
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice.toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              { !order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? <Loader /> : (
                    <div>
                      {/* <Button 
                        onClick={onApproveTest}
                        style={{marginBottom: '10px'}}
                      >Test Pay Order</Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={ createOrder }
                          onApprove={ onApprove }
                          onError={ onError }
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              { userInfo &&
                userInfo.isAdmin &&
                order.isPaid && 
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverOrderHandler}
                    >Mark as Delivered
                    </Button>
                  </ListGroup.Item>
              ) }
                
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
