import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function Suppliers() {

    const [suppliers, setSuppliers] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newName, setNewName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    const [supplierCount, setSupplierCount] = useState(0);

    const openModal = (supplier) => {
        setCurrentSupplier(supplier);
        setNewName(supplier.name);
        setNewLocation(supplier.location);
        setNewPhone(supplier.phone);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSupplier(null);
        setNewName('');
        setNewLocation('');
        setNewPhone('');
    }

    const fetchSuppliersCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/suppliers/fetchSupplierCount', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSupplierCount(response.data.count);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchSuppliersCount();
    }, []);


    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/suppliers/fetchSupplier', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuppliers(response.data);
            fetchSuppliersCount();
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchSuppliers();
    }, []);


    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return `SPL-${randomNumber}`;
    };
    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!newName || !newLocation || !newPhone) {
            toast.error("All fields are required.");
            return;
        }
        if (newName.trim().length === 0) {
            toast.error("Supplier name cannot be empty");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5015/api/suppliers/addSupplier', {code: newCode, name: newName, location: newLocation, phone: newPhone},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchSuppliers();
            toast.success(response.data.message);
        }catch{
            toast.error('Something went wrong');
        }
    }

    const handleDelete = async (supplierId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5015/api/suppliers/deleteSupplier/${supplierId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuppliers(prev => prev.filter(spl => spl.id !== supplierId));
            fetchSuppliersCount();
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (supplierId, Newname, NewLocation, NewPhone) => {
        if (!Newname || !newLocation || !newPhone) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5015/api/suppliers/updateSupplier/${supplierId}`, {name: Newname, location: newLocation, phone: newPhone},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuppliers(prev =>
                prev.map(spl => spl.id === supplierId ? { ...spl, name: newName, location: newLocation, phone: newPhone } : spl)
            );
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    useEffect(() => {
        document.title = 'Suppliers';
    }, []);

    return (
        <>
            <HeaderTitle title="Suppliers" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="data-header">
                        <h3>Total Suppliers : {supplierCount}</h3>
                    </div>
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Supplier Code</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {suppliers?.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.code}</td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.location}</td>
                                    <td>{supplier.phone}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(supplier)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(supplier.id)}><i className='bx bx-trash'></i></button>
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
                        <h3>Add Supplier</h3>
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
                        <h3>Edit Supplier</h3>
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
                            <button onClick={() => handleEdit(currentSupplier.id, newName, newLocation, newPhone)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default Suppliers