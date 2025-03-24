import React from 'react';

const DeleteConfirmationModal = ({ onDelete, accountToDelete, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 ${accountToDelete ? 'flex' : 'hidden'} items-center justify-center bg-black/30`}
      id="deleteConfirmationModal"
      aria-labelledby="deleteConfirmationModalLabel"
      aria-hidden={!accountToDelete}
    >
      {/* Modal Dialog */}
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-lg shadow-xl bg-white max-w-md w-full">
          {/* Modal Body */}
          <div className="modal-body p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Delete Account</h3>
            {accountToDelete && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the account:
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  Account #{accountToDelete.accountNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Holder: {accountToDelete.fullName}
                </p>
              </div>
            )}
            <p className="mt-2 text-sm text-red-500 text-center">
              This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
