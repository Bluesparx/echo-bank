import React, { useEffect, useState, useContext } from 'react'
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from '@/config/Firebase';
import { Link } from "react-router-dom"
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { announce } from '@/services/textToSpeech';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';

function ViewTransactions() {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)    
  const { user } = useContext(AuthenticatedContext)
  const [docId, setDocId] = useState("")
  const [transactionDetail, setTransactionDetail] = useState({})

  const availableActions = [
    'Say "create transaction" to create a new transaction',
    'Say "read transactions" to hear your transaction list',
    'Say "read details" to hear details of the selected transaction',
    'Say "back to dashboard" to return to dashboard',
    'Say "refresh" to update the transaction list'
  ];

  usePageAnnouncement('View Transactions Page', availableActions);

  const handleVoiceCommand = (command) => {
    switch (command.toLowerCase()) {
      case 'create transaction':
        navigate('/dashboard/createTransaction');
        break;
      case 'read transactions':
        readTransactions();
        break;
      case 'read details':
        if (transactionDetail) {
          readTransactionDetails();
        } else {
          announce('Please select a transaction first by saying its number');
        }
        break;
      case 'back to dashboard':
        navigate('/dashboard');
        break;
      case 'refresh':
        readDocs();
        break;
      default:
        announce('Command not recognized. Please try again.');
    }
  };

  const readTransactions = () => {
    if (documents.length === 0) {
      announce('You have no transactions yet. Say "create transaction" to create one.');
      return;
    }

    let announcement = 'Your transactions are: ';
    documents.forEach((doc, index) => {
      announcement += `Transaction ${index + 1}: ${doc.type} of ${doc.amount} dollars`;
      if (index < documents.length - 1) {
        announcement += ', ';
      }
    });
    announce(announcement);
  };

  const readTransactionDetails = () => {
    if (!transactionDetail) return;

    let announcement = `Transaction details: Type: ${transactionDetail.type}, `;
    announcement += `Amount: ${transactionDetail.amount} dollars, `;
    announcement += `Date: ${new Date(transactionDetail.date).toLocaleDateString()}, `;
    announcement += `Description: ${transactionDetail.description || 'No description'}`;
    announce(announcement);
  };

  const handleClick = (doc) => {
    setDocId(doc.id);
    announce(`Transaction ${documents.findIndex(d => d.id === doc.id) + 1} selected. Say "read details" to hear more.`);
  }
  
  const readDocs = async () => {
    let array = []

    const accountsRef = collection(firestore, "transactions");
    const q = query(accountsRef, where("createdBy.uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id });
    });
    
    setDocuments(array)
    setIsLoading(false)
  }

  useEffect(() => {
    readDocs()
  }, [])

  useEffect(() => {
    const selectedDoc = documents.find(doc => doc.id === docId);
    if (selectedDoc) {
      setTransactionDetail(selectedDoc);
    }
  }, [docId, documents])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-16">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-12 w-12 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500 text-lg">Loading your transactions...</p>
                </div>
              </div>
            ) : (
              <>
                {documents.length < 1 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-500 text-center mb-6">You haven't created any transactions in this account.</p>
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
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => handleClick(doc)} 
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-150 hover:underline"
                                data-bs-toggle="modal" 
                                data-bs-target="#staticBackdrop"
                              >
                                {doc.id}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.dateCreated.toDate().toLocaleTimeString('en-US')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.dateCreated.toDate().toDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.accountId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                doc.type === 'credit' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={doc.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                {doc.type === 'credit' ? '+' : '-'}₹{doc.amount}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-lg shadow-xl">
            <div className="modal-body p-0">
              <div className="bg-gray-50 px-6 py-4 rounded-t-lg border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                  <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200" data-bs-dismiss="modal">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="text-base font-medium text-gray-900">{docId}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account ID</p>
                    <p className="text-base font-medium text-gray-900">{transactionDetail.accountId || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Holder</p>
                    <p className="text-base font-medium text-gray-900">{transactionDetail.fullName || '-'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {transactionDetail?.dateCreated?.toDate()?.toDateString() || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time</p>
                    <p className="text-base font-medium text-gray-900">
                      {transactionDetail?.dateCreated?.toDate()?.toLocaleTimeString('en-US') || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <span className={`mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      transactionDetail.type === 'credit' 
                        ? 'bg-green-100 text-green-800' 
                        : transactionDetail.type === 'debit'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transactionDetail.type || '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <p className={`text-lg font-bold ${
                      transactionDetail.type === 'credit' 
                        ? 'text-green-600' 
                        : transactionDetail.type === 'debit'
                          ? 'text-red-600'
                          : 'text-gray-900'
                    }`}>
                      {transactionDetail.type === 'credit' ? '+' : transactionDetail.type === 'debit' ? '-' : ''}
                      ₹{transactionDetail.amount || '0'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {transactionDetail.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewTransactions