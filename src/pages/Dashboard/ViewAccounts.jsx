import React, { useEffect, useState, useContext } from 'react'
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import { firestore } from '@/config/Firebase';
import { Link } from "react-router-dom"
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { toast } from 'react-toastify';
import { announce } from '@/services/textToSpeech';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';

// Import components
import AccountsTable from '@/components/accounts/AccountsTable';
import DeleteConfirmationModal from '@/components/accounts/DeleteConfirmationModal';

function ViewAccounts() {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(AuthenticatedContext)
  const [accountToDelete, setAccountToDelete] = useState(null)

  const availableActions = [
    'Say "create account" to create a new account',
    'Say "read accounts" to hear your account list',
    'Say "delete account" to delete an account',
    'Say "back to dashboard" to return to dashboard',
    'Say "refresh" to update the account list'
  ];

  usePageAnnouncement('View Accounts Page', availableActions);


  const readDocs = async () => {
    let array = []
    const accountsRef = collection(firestore, "accounts");
    const q = query(accountsRef, where("createdBy.uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      array.push({ ...data, id: doc.id });
    });

    setDocuments(array)
    setIsLoading(false)
  }

  useEffect(() => {
    readDocs()
  }, [])

  const handleDeleteClick = (account) => {
    setAccountToDelete(account)
    announce(`Delete account ${account.accountName}? Say "confirm delete" to proceed or "cancel" to cancel.`);
  }

  const handleDelete = async () => {
    if (!accountToDelete) return;
    
    try {
      await deleteDoc(doc(firestore, "accounts", accountToDelete.id));
      announce(`Account ${accountToDelete.accountName} deleted successfully`);
      toast.success("Account Deleted Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      readDocs();
    } catch (error) {
      announce('Error deleting account. Please try again.');
      console.error("Error deleting account:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
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
                  <p className="text-gray-500 text-lg">Loading your accounts...</p>
                </div>
              </div>
            ) : (
              <>
                {documents.length < 1 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
                    <p className="text-gray-500 text-center mb-6">You haven't created any accounts yet.</p>
                    <Link
                      to="/dashboard/createAccount"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <AccountsTable 
                    documents={documents}
                    onDeleteClick={handleDeleteClick}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal 
        onDelete={handleDelete} 
        accountToDelete={accountToDelete}
      />
    </div>
  )
}

export default ViewAccounts;