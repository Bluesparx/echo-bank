import React, {useContext} from 'react'
import { Link } from "react-router-dom"
import { auth } from '@/config/Firebase';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';

function Navbar() {
    const {isAuthenticated, setIsAuthenticated, setCountAccount, setCountTransaction} = useContext(AuthenticatedContext);
    
    const handleClick = () => {
        signOut(auth).then(() => {
            toast.success('User has been logged out!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
             });
            setIsAuthenticated(false)
        }).catch((error) => {
            toast.error(error.message, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="text-white font-bold text-xl hover:text-blue-200 transition-colors duration-200"
                        >
                            ECHO BANK
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {!isAuthenticated ? (
                            <Link 
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link 
                                    to="/dashboard"
                                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar 