import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth, provider } from "@/config/Firebase"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { startListening, stopListening } from '@/services/speechRecognition';
import { speak, announce } from '@/services/textToSpeech';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';

const initialState = { email: "", password: "", confirmPassword: "", name: "" }

function SignUp() {
  const { setIsAuthenticated } = useContext(AuthenticatedContext);
  const navigate = useNavigate();
  const [state, setState] = useState(initialState)
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listeningStates, setListeningStates] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  const availableActions = [
    'Enter name, email, and password to create account',
    'Use voice input the fields',
    'Sign up with Google',
    'Return to login page',
    'Return to home page'
  ];

  usePageAnnouncement('Sign Up Page', availableActions);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleVoiceInput = (field, value) => {
    setState(prev => ({
      ...prev,
      [field]: value
    }));
    announce(`${field} received`);
  };

  const startVoiceInput = (field) => {
    if (listeningStates[field]) {
      stopListening();
      setListeningStates(prev => ({
        ...prev,
        [field]: false
      }));
      announce('Voice input stopped');
    } else {
      Object.keys(listeningStates).forEach(key => {
        if (listeningStates[key]) {
          stopListening();
        }
      });
      
      setListeningStates(prev => ({
        ...prev,
        [field]: true
      }));
      announce(`Listening for ${field}`);
      startListening(
        (transcript) => handleVoiceInput(field, transcript),
        (error) => {
          announce('Voice recognition error. Please try again.');
          setListeningStates(prev => ({
            ...prev,
            [field]: false
          }));
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password, confirmPassword } = state

    if (!email || !password || !confirmPassword) {
      announce('Please fill in all fields');
      toast.error('Please fill in all fields', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      announce('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
      return;
    }

    if (password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: state.name
        });
        setIsAuthenticated(true);
        announce('Account created successfully!');
        navigate("/dashboard/viewAccounts");
        toast.success('Account created successfully!');
      } catch (error) {
        console.error(error);
        announce('Account creation failed: ' + error.message);
        toast.error(error.message, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsAuthenticated(false)
      setIsLoading(false);
      announce('Passwords do not match');
      toast.error('Passwords do not match!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const handleGoogleAuthentication = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        announce('Successfully signed up with Google!');
        toast.success('Successfully signed up with Google!', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsAuthenticated(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        announce('Google signup failed: ' + error.message);
        toast.error(error.message, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={state.name}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => startVoiceInput('name')}
                  className={`ml-2 p-2 rounded-full ${
                    listeningStates.name ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90`}
                  aria-label="Use voice input for name"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={state.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => startVoiceInput('email')}
                  className={`ml-2 p-2 rounded-full ${
                    listeningStates.email ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90`}
                  aria-label="Use voice input for email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type={isPasswordShow ? "text" : "password"}
                    required
                    value={state.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => startVoiceInput('password')}
                  className={`ml-2 p-2 rounded-full ${
                    listeningStates.password ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90`}
                  aria-label="Use voice input for password"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={isConfirmPasswordShow ? "text" : "password"}
                    required
                    value={state.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => startVoiceInput('confirmPassword')}
                  className={`ml-2 p-2 rounded-full ${
                    listeningStates.confirmPassword ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90`}
                  aria-label="Use voice input for confirm password"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleAuthentication}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp