import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from '@/config/Firebase';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { Rings } from "react-loader-spinner";
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { announce } from '@/services/textToSpeech';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/config/Firebase';

function Dashboard() {
  const { user } = useContext(AuthenticatedContext)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [totalCredit, setTotalCredit] = useState(0)
  const [totalDebit, setTotalDebit] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState([])
  const navigate = useNavigate()

  // Define available actions for the page
  const availableActions = [
    'See your accounts',
    'View your transactions',
    'create a new account',
    'Save a new transaction',
    'Hear your account summary'
  ];

  // Use the page announcement hook
  usePageAnnouncement('Dashboard Page', availableActions);

  const handleVoiceCommand = (command) => {
    switch (command.toLowerCase()) {
      case 'view accounts':
        navigate('/dashboard/viewAccounts');
        break;
      case 'view transactions':
        navigate('/dashboard/viewTransactions');
        break;
      case 'create account':
        navigate('/dashboard/createAccount');
        break;
      case 'create transaction':
        navigate('/dashboard/createTransaction');
        break;
      case 'read summary':
        readSummary();
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        announce('Command not recognized. Please try again.');
    }
  };

  const readDocs = async () => {
    let arrayAccounts = []
    let arrayTransactions = []

    //accounts
    const accountsRef = collection(firestore, "accounts");
    const qa = query(accountsRef, where("createdBy.uid", "==", user.uid));
    const querySnapshotaccounts = await getDocs(qa);

    //transactions
    const transactionsRef = collection(firestore, "transactions");
    const qt = query(transactionsRef, where("createdBy.uid", "==", user.uid));
    const querySnapshottransactions = await getDocs(qt);

    querySnapshotaccounts.forEach((doc) => {
      arrayAccounts.push(doc.data())
    });
    
    let credit = 0;
    let debit = 0;
    querySnapshottransactions.forEach((doc) => {
      arrayTransactions.push(doc.data())
      if (doc.data().type === "credit") {
        credit = credit + parseInt(doc.data().amount)
      } else {
        debit = debit + parseInt(doc.data().amount)
      }
    });
    
    setTotalCredit(credit)
    setTotalDebit(debit)
    setTotalAccounts(arrayAccounts.length)
    setTotalTransactions(arrayTransactions.length)
    setDocuments(arrayAccounts)
    setIsLoading(false)

    // Announce the summary
    if (!isLoading) {
      const currentBalance = credit - debit;
      const announcement = `Your dashboard summary: You have ${arrayAccounts.length} accounts and ${arrayTransactions.length} transactions. ` +
        `Total credits: ${credit.toLocaleString()} rupees, total debits: ${debit.toLocaleString()} rupees. ` +
        `Current balance: ${currentBalance.toLocaleString()} rupees.`;
      announce(announcement);
    }
  }

  const readSummary = () => {
    if (documents.length === 0) {
      announce('You have no accounts yet. Say "create account" to create one.');
      return;
    }

    let totalBalance = 0;
    let announcement = 'Your account summary: ';
    
    documents.forEach((doc, index) => {
      totalBalance += parseFloat(doc.balance);
      announcement += `${doc.accountName} has ${doc.balance} rupees`;
      if (index < documents.length - 1) {
        announcement += ', ';
      }
    });
    
    announcement += `. Total balance: ${totalBalance.toLocaleString()} rupees. ` +
      `You have ${totalTransactions} transactions with total credits of ${totalCredit.toLocaleString()} rupees and total debits of ${totalDebit.toLocaleString()} rupees.`;
    
    announce(announcement);
  }

  const handleLogout = () => {
    announce('Logging out...');
    auth.signOut().then(() => {
      navigate('/');
    }).catch((error) => {
      announce('Error logging out. Please try again.');
    });
  };

  useEffect(() => {
    readDocs()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      readSummary()
    }
  }, [isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-500">Welcome, {user?.displayName || 'User'}</span>
            </div>
          </div>

          {!isLoading && totalAccounts === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Echo Bank!</h2>
                <p className="text-gray-600 mb-6">Let's get started by creating your first account.</p>
                <Link
                  to="/dashboard/createAccounts"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Account
                </Link>
              </div>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Accounts Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-semibold text-gray-900 mb-1">Total Accounts</dt>
                      <dd>
                        {isLoading ? (
                          <div className="flex justify-center">
                            <Rings color="#3B82F6" height={40} width={40} />
                          </div>
                        ) : (
                          <div className="text-3xl font-bold text-gray-900">{totalAccounts}</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm flex justify-between flex-wrap gap-3">
                  <Link
                    to="/dashboard/createAccounts"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Account
                  </Link>
                  <Link
                    to="/dashboard/viewAccounts"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View All Accounts
                  </Link>
                </div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-semibold text-gray-900 mb-1">Total Transactions</dt>
                      <dd>
                        {isLoading ? (
                          <div className="flex justify-center">
                            <Rings color="#8B5CF6" height={40} width={40} />
                          </div>
                        ) : (
                          <div>
                            <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
                            <div className="mt-4 grid grid-cols-2 gap-6">
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-green-800">Total Credits</p>
                                <p className="text-xl font-bold text-green-700">₹{totalCredit.toLocaleString()}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-red-800">Total Debits</p>
                                <p className="text-xl font-bold text-red-700">₹{totalDebit.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm flex justify-between">
                  <Link
                    to="/dashboard/viewTransactions"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View All Transactions
                  </Link>
                  <Link
                    to="/dashboard/createTransaction"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Transaction
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Section */}
          {!isLoading && (
            <div className="mt-8">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Current Balance</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(totalCredit - totalDebit).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Average Transaction</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalTransactions > 0 
                          ? `₹${((totalCredit + totalDebit) / totalTransactions).toFixed(0).toLocaleString()}` 
                          : '₹0'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Credit/Debit Ratio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalDebit > 0 
                          ? (totalCredit / totalDebit).toFixed(2) 
                          : totalCredit > 0 ? '∞' : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard