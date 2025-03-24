import React from 'react'
import Dashboard from './Dashboard';
import ViewTransactions from './ViewTransactions';
import ViewAccounts from './ViewAccounts';
import CreateAccounts from "./CreateAccounts"
import CreateTransaction from "./CreateTransaction"
import { Routes, Route } from 'react-router-dom'
import { Link } from "react-router-dom"

function DashboardLayout() {
  return (
    <>
      <header className='header'>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand" ><i className="fa-solid fa-house"></i></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link active" aria-current="page">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/viewAccounts" className="nav-link">Accounts</Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/viewTransactions" className="nav-link">Transactions</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className='contentArea'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/viewTransactions" element={<ViewTransactions />} />
          <Route path="/createAccounts" element={<CreateAccounts />} />
          <Route path="/viewAccounts" element={<ViewAccounts />} />
          <Route path="/createTransaction" element={<CreateTransaction />} />
        </Routes>
      </div>
    </>
  )
}

export default DashboardLayout 