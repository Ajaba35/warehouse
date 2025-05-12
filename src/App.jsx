import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'
import 'boxicons/css/boxicons.min.css';
import Dashboard from "./pages/Dashboard.jsx";
import {useState} from "react";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Sales from "./pages/Sales.jsx";
import Purchases from "./pages/Purchases.jsx";
import Suppliers from "./pages/suppliers.jsx";
import Customers from "./pages/Customers.jsx";
import Account from "./pages/Account.jsx"
import Settings from "./pages/Settings.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import { UserProvider } from './context/UserContext';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Appinfo from "./pages/Appinfo.jsx";

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('token');
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

function App() {
    const [showBar, setShowBar] = useState(false);

    const toggleBar = () => {
        setShowBar(prev => !prev);
    };

  return (
      <Router>
          <Routes>

              <Route path="/login" element={<Login />} />
              <Route
                  path="/*"
                  element={
                      <div>
                          <UserProvider>
                          <NavBar toggleBar={toggleBar} showBar={showBar} />
                          <div className="main">
                              <SideBar showBar={showBar} />
                              <div className="content">
                                  <PrivateRoute>
                                  <Routes>
                                      <Route path="/" element={<Dashboard />} />
                                      <Route path="/products" element={<Products />} />
                                      <Route path="/categories" element={<Categories />} />
                                      <Route path="/sales" element={<Sales />} />
                                      <Route path="/purchases" element={<Purchases />} />
                                      <Route path="/suppliers" element={<Suppliers />} />
                                      <Route path="/customers" element={<Customers />} />
                                      <Route path="/account" element={<Account />} />
                                      <Route path="/appinfo" element={<Appinfo />} />
                                      <Route path="/users" element={<ProtectedRoute role='admin'><Users /></ProtectedRoute>} />
                                      <Route path="/settings" element={<ProtectedRoute role='admin'><Settings /></ProtectedRoute>} />
                                  </Routes>
                                  </PrivateRoute>
                              </div>
                          </div>
                          </UserProvider>
                      </div>
                  }
              />
          </Routes>
      </Router>
  )
}

export default App


