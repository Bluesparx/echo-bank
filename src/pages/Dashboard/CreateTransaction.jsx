import React, { useState, useContext } from 'react'
import { firestore } from '@/config/Firebase';
import { serverTimestamp, setDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { Link } from 'react-router-dom';

const initialState = {
  amount: "",
  description: "",
  accountId: "",
  type: "credit",
  fullName: ""
}

function CreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthenticatedContext);
  const [state, setState] = useState(initialState);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAccounts = async () => {
      const accountsRef = collection(firestore, "accounts");
      const q = query(accountsRef, where("createdBy.uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const accountsList = [];
      querySnapshot.forEach((doc) => {
        accountsList.push(doc.data());
      });
      setAccounts(accountsList);
    };
    fetchAccounts();
  }, [user.uid]);

  const handleChange = e => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }));
    if (e.target.name === "accountId") {
      const selectedAccount = accounts.find(acc => acc.id === e.target.value);
      if (selectedAccount) {
        setState(s => ({ ...s, fullName: selectedAccount.fullName }));
      }
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (state.amount <= 0) {
      toast.error('Amount must be greater than 0', {
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

    if (!state.accountId) {
      toast.error('Please select an account', {
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

    const selectedAccount = accounts.find(acc => acc.id === state.accountId);
    if (state.type === 'debit' && parseInt(state.amount) > parseInt(selectedAccount.initialDeposit)) {
      toast.error('Insufficient balance for withdrawal', {
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

    const transactionData = {
      ...state,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      createdBy: {
        email: user.email,
        uid: user.uid
      }
    };

    try {
      // Create transaction
      await setDoc(doc(firestore, "transactions", transactionData.id), transactionData);

      // Update account balance
      const newBalance = state.type === 'credit' 
        ? parseInt(selectedAccount.initialDeposit) + parseInt(state.amount)
        : parseInt(selectedAccount.initialDeposit) - parseInt(state.amount);
      
      await setDoc(doc(firestore, "accounts", state.accountId), {
        ...selectedAccount,
        initialDeposit: newBalance.toString()
      });

      toast.success(`Transaction completed successfully!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/dashboard/viewTransactions");
    } catch (error) {
      console.error("Error creating transaction: ", error);
      toast.error('Failed to create transaction', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-6 px-6">
            <h1 className="text-2xl font-bold text-white text-center">Create New Transaction</h1>
            <p className="text-purple-100 text-center text-sm mt-1">All fields are required*</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Account Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
                  <select
                    name="accountId"
                    value={state.accountId}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountNumber} - {account.fullName} (Balance: ₹{account.initialBalance})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                  <select
                    name="type"
                    value={state.type}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="credit">Credit (Deposit)</option>
                    <option value="debit">Debit (Withdraw)</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={state.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    placeholder="Enter transaction description"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-between items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Transaction
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTransaction; 