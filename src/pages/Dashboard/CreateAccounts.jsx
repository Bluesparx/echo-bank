import React, { useState, useContext } from 'react'
import { firestore } from '@/config/Firebase';
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';

const initialState = {
  fullName: "",
  CNIC: "",
  branchCode: "",
  accountNumber: "",
  accountType: "Saving",
  initialDeposit: "",
  date: "",
  time: "",
  userId: "",
  id: "",
  description: "Initial Amount"
}

function CreateAccounts() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthenticatedContext);
  const [state, setState] = useState(initialState);
  const Navigate = useNavigate();

  const handleChange = e => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (state.fullName === " ") {
      toast.error('Your Name field is empty that is not acceptable.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (state.CNIC.length !== 13) {
      toast.error('CNIC length should be 13', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (state.branchCode > 99) {
      toast.error('You can use only 99 branches.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (state.accountNumber.length !== 9) {
      toast.error('Your Account number length should be 9', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (state.initialDeposit < 500) {
      toast.error('Your initial Deposit is less than 500 PKR.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);
    state.date = dayjs().format('DD/MM/YYYY');
    state.time = dayjs().format('hh:mm:ss A');
    state.userId = user.uid;
    state.id = Math.random().toString(36).slice(2);

    let accountData = {
      ...state,
      createdBy: {
        email: user.email,
        uid: user.uid
      }
    }

    try {
      console.log(accountData)
      const docRef = await setDoc(doc(firestore, "accounts", state.id), accountData);
      console.log(accountData)
      console.log(docRef)
      toast.success(`Dear ${accountData.fullName}, your Account has been Created against Account # ${accountData.accountNumber}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("data added successfully to dataBase");
      Navigate("/dashboard/viewAccounts")
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.success(e, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setIsLoading(false);
    }
    
    // transaction code
    let { initialDeposit, description } = state
    let transactionData = {
      amount: initialDeposit,
      description,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      accountId: state.id,
      type: 'credit',
      fullName: state.fullName,
      createdBy: {
        email: user.email,
        uid: user.uid
      }
    }
    try {
      await setDoc(doc(firestore, "transactions", transactionData.id), transactionData)
      console.log("Transaction done", transactionData)
    } catch (err) {
      console.error(err)
    }
    console.log(state)
    setState(initialState);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-6">
            <h1 className="text-2xl font-bold text-white text-center">Enter Account Details Below</h1>
            <p className="text-blue-100 text-center text-sm mt-1">All fields are required*</p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Full Name"
                    name="fullName"
                    value={state.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* CNIC */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="CNIC Number (length should be 13)"
                    name="CNIC"
                    value={state.CNIC}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Branch Code */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Branch Code (1 - 99)"
                    name="branchCode"
                    value={state.branchCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Account Number */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Account Number (Length should be 9)"
                    name="accountNumber"
                    value={state.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Account Type */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <select 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    name="accountType"
                    value={state.accountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Saving">Saving</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
                
                {/* Initial Deposit */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Initial Deposit (Minimum 500 Rs.)"
                    name="initialDeposit"
                    value={state.initialDeposit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
                >
                  {!isLoading ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Create Account
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccounts;