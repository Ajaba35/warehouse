import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useUser();

    if (loading) return null;

    if (!user || (role && user.role !== role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;