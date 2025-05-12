import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function Customers() {

    const [customers, setCustomers] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newName, setNewName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

    const [customerCount, setCustomerCount] = useState(0);

    const openModal = (customer) => {
        setCurrentCustomer(customer);
        setNewName(customer.name);
        setNewLocation(customer.location);
        setNewPhone(customer.phone);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCustomer(null);
        setNewName('');
        setNewLocation('');
        setNewPhone('');
    }


    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/customers/fetchCustomer', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCustomers(response.data);
            const customerCount = response.data.length;
            setCustomerCount(customerCount);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchCustomers();
    }, []);


    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return `CS-${randomNumber}`;
    };
    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!newName || !newLocation || !newPhone) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5015/api/customers/addCustomer', {code: newCode, name: newName, location: newLocation, phone: newPhone},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchCustomers();
            toast.success(response.data.message);
        }catch{
            toast.error('Something went wrong');
        }
    }

    const handleDelete = async (customerId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5015/api/customers/deleteCustomer/${customerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCustomers(prev => prev.filter(cs => cs.id !== customerId));
            setCustomerCount(customerCount);
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (customerId, Newname, NewLocation, NewPhone) => {
        if (!newName || !newLocation || !newPhone) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5015/api/customers/updateCustomer/${customerId}`, {name: Newname, location: newLocation, phone: newPhone},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCustomers(prev =>
                prev.map(cs => cs.id === customerId ? { ...cs, name: newName, location: newLocation, phone: newPhone } : cs)
            );
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    useEffect(() => {
        document.title = 'Customers';
    }, []);

    return (
        <>
            <HeaderTitle title="Customers" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="data-header">
                        <h3>Total Customers : {customerCount}</h3>
                    </div>
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Customer Code</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers?.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.code}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.location}</td>
                                    <td>{customer.phone}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(customer)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(customer.id)}><i className='bx bx-trash'></i></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Add Customer</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={newLocation}
                                onChange={e => setNewLocation(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={newPhone}
                                onChange={e => setNewPhone(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleAdd}>Add</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Edit Customer</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentCustomer.id, newName, newLocation, newPhone)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default Customers