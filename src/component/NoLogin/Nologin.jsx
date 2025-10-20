
import { Navigate } from 'react-router';
import LoginPrompt from '../LoginPrompt';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Nologin = ({ children }) => {
     const { currentUser, loading } = useAuth(); 
    const [showRedirect, setShowRedirect] = useState(false);

    useEffect(() => {
        if (!loading && !currentUser) {            
            const timer = setTimeout(() => {
                setShowRedirect(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [currentUser, loading]);
    
    if (showRedirect) {
        return <Navigate to="/login" replace />;
    }
    
    if (!loading && !currentUser) {
        return <LoginPrompt />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default Nologin;