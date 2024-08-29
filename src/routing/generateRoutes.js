import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import Dashboard from '../views/dashboard';
import Login from '../views/login';
import { useEffect, useState } from 'react';

function GenerateRoutes() {
    let location = useLocation();
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('Authenticated'));
    }, [isAuthenticated]);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('Authenticated'));

        if (isAuthenticated == 'false') {
            navigate('/');
        } else {
            navigate('/dashboard');
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route exact path='/' element={<Login />} />
            {
                <Route path='/dashboard' element={<Dashboard />}/>}

            <Route
                path='*'
                element={
                    <Navigate to={'/'} state={{ from: location }} replace />
                }
            />
        </Routes>
    );
}

export default GenerateRoutes;
