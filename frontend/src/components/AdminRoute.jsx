import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  // Check if user is logged in
  // Route them to correct screen if they are, otherwise to login
  const { userInfo } = useSelector(state => state.auth)

  return (
    userInfo && userInfo.isAdmin ? (
      <Outlet /> 
    ) : (
      <Navigate to='/login' replace />
    )
  )
}

export default AdminRoute
