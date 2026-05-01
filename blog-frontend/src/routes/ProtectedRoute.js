import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useCheckQuery } from '../lib/api/auth';

function ProtectedRoute() {
	const { isLoading } = useCheckQuery();
	const user = useSelector((state) => state.user.user);

	if (isLoading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" replace />;

	return <Outlet />;
}

export default ProtectedRoute;
