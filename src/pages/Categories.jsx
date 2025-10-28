import HeaderTitle from "../components/HeaderTitle.jsx";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function Categories() {

    const [categories, setCategories] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newName, setNewName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const openModal = (category) => {
        setCurrentCategory(category);
        setNewName(category.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setNewName('');
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/categories/fetchCategory', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(response.data);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://warehouse-2riz.onrender.com/api/categories/deleteCategory/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (categoryId, Newname) => {
        if (!Newname) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://warehouse-2riz.onrender.com/api/categories/updateCategory/${categoryId}`, {name: Newname},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(prev =>
                prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat)
            );
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);  // ensures 6 digits
        return `CAT-${randomNumber}`;
    };

    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!newName) {
            toast.error("All fields are required.");
            return;
        }
        if (newName.trim().length === 0) {
            toast.error("Category name cannot be empty");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://warehouse-2riz.onrender.com/api/categories/addCategory', {code: newCode, name: newName},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchCategories();
            toast.success(response.data.message);
        }catch{
            toast.error('Something went wrong');
        }
    }

    useEffect(() => {
        document.title = 'Categories';
    }, []);

    return (
        <>
            <HeaderTitle title="Categories" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Category Code</th>
                                <th>Category Name</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories?.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.code}</td>
                                    <td>{category.name}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(category)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(category.id)}><i className='bx bx-trash'></i></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Edit Category</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentCategory.id, newName)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Add Category</h3>
                         <div className="modal-inputs">
                             <input
                                 type="text"
                                 placeholder="Name"
                                 value={newName}
                                 onChange={e => setNewName(e.target.value)}
                             />
                         </div>
                        <div className="modal-actions">
                            <button onClick={handleAdd}>Add</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default Categories