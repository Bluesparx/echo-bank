import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, provider } from '@/config/Firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { SpeechRecognition } from '@/services/speechRecognition';
import { speak, announce } from '@/services/textToSpeech';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';

const initialState = { email: "", password: "" }

function Login() {
  const { startListening, stopListening, isListening, error } = SpeechRecognition();
  const [formData, setFormData] = useState(initialState)
  const [user, setUser] = useState({})
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listeningStates, setListeningStates] = useState({
    email: false,
    password: false
  })
  const timeoutRef = React.useRef(null);
  const { isAuthenticated, setIsAuthenticated, userId, setUserId } = useContext(AuthenticatedContext);
  const navigate = useNavigate();

  const availableActions = [
    'Enter email and password to sign in',
    'Use voice input for the fields',
    'Sign in with Google',
    'Return to home page',
    'Go to Sign up',
  ];

  usePageAnnouncement('Login Page', availableActions);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setUserId(user.uid)
      } else {
        setUser({})
      }
    });

    return () => unsubscribe();
  }, [setUserId])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleVoiceInput = (transcript) => {
    // Process the transcript before setting form data
    let processedTranscript = transcript
      .toLowerCase() // Ensure everything is lowercase first
      .replace(/\b(at the rate|at)\b/g, '@') // Convert "at the rate" or "at" to @
      .replace(/\b(dot|period)\b/g, '.') // Convert "dot" or "period" to .
      .replace(/\b(underscore|under score)\b/g, '_') // Convert "underscore" to _
      .replace(/\b(hyphen|dash)\b/g, '-') // Convert "hyphen" or "dash" to -
      .replace(/\s+/g, '') // Remove all spaces
      .trim();

    // Convert number words to digits
    const numberWords = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };
    Object.entries(numberWords).forEach(([word, digit]) => {
      processedTranscript = processedTranscript.replace(new RegExp(word, 'g'), digit);
    });

    // Handle uppercase letters only when specifically requested
    processedTranscript = processedTranscript.replace(/upper case ([a-z])/g, (match, letter) => letter.toUpperCase());

    setFormData(prev => ({
      ...prev,
      [activeField]: processedTranscript
    }));
  };

  const startVoiceInput = (field) => {
    if (listeningStates[field]) {
      stopListening();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setListeningStates(prev => ({
        ...prev,
        [field]: false
      }));
      announce('input stop');
    } else {
      Object.keys(listeningStates).forEach(key => {
        if (listeningStates[key]) {
          stopListening();
        }
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setListeningStates(prev => ({
        ...prev,
        [field]: true
      }));
      announce(`${field}`);
      startListening(
        (transcript) => handleVoiceInput(transcript),
        (error) => {
          announce('Voice recognition error. Please try again.');
          setListeningStates(prev => ({
            ...prev,
            [field]: false
          }));
        },
        field === 'email'
      );

      timeoutRef.current = setTimeout(() => {
        setListeningStates(prev => {
          if (prev[field]) {
            stopListening();
            announce('input stopped');
            return {
              ...prev,
              [field]: false
            };
          }
          return prev;
        });
      }, 5000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        announce('Login successful');
        toast.success('User has been logged In!', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsAuthenticated(true);
        navigate("/dashboard")
      })
      .catch((error) => {
        console.error(error)
        announce('Login failed. Please check your credentials.');
        toast.error("password/email incorrect", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const handleGoogleAuthentication = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        announce('Google login successful');
        toast.success("User has been logged in!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        navigate("/dashboard")
      }).catch((error) => {
        announce('Google login failed');
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      });
  }

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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
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
                  'Sign in'
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

            <div className="mt-6 ">
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

export default Login