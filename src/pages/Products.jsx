import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import useSystemSettings from '../hooks/useSystemSettings';


function Products() {
    const { defaultCurrency, systemInfo } = useSystemSettings();
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [selectedFilterCategory, setSelectedFilterCategory] = useState('');


    const openModal = (product) => {
        setCurrentProduct(product);
        setNewName(product.name);
        setNewPrice(product.price);
        setSelectedCategory(product.category_id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
        setNewName('');
        setNewPrice('');
        setSelectedCategory('');
    };


    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');

            const params = {};

            if (selectedFilterCategory) {
                params.category_id = selectedFilterCategory;
            }

            if (searchText.trim() !== '') {
                params.code = searchText.trim();
            }
            const response = await axios.get('http://localhost:5015/api/products/fetchProduct', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            setProducts(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, [selectedFilterCategory]);


    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);  // ensures 6 digits
        return `PR-${randomNumber}`;
    };
    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!newName || !newPrice || !selectedCategory) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5015/api/products/addProduct', {code: newCode, name: newName, price: newPrice, category_id:selectedCategory},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchProducts();
            toast.success(response.data.message);
        }catch{
            toast.error('Something went wrong');
        }
    }


    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/categories/fetchCategory', {
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

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5015/api/products/deleteProduct/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(prev => prev.filter(prod => prod.id !== productId));
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    };
    const handleEdit = async (productId, Newname) => {
        if (!Newname || !newPrice || !selectedCategory) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5015/api/products/updateProduct/${productId}`, {name: Newname, price:newPrice, category_id:selectedCategory},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchProducts();
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    useEffect(() => {
        document.title = 'Products';
    }, []);

    return (
        <>
            <HeaderTitle title="Products" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
            <div className="data-box">
                <div className="data-header">
                    <div className="filter-container">
                        <select value={selectedFilterCategory} onChange={(e) => {
                            setSelectedFilterCategory(e.target.value);  // Update the selected category
                        }}>
                            <option value="">Show All Products</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Search product by code"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            fetchProducts();
                        }}
                    />
                </div>
                <div className="product-table-container">

                    <table className="product-table">
                        <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Sold</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products?.map((product) => (
                            <tr key={product.id}>
                                <td>{product.code}</td>
                                <td>{product.name}</td>
                                <td>{product.category_name}</td>
                                <td>{product.price} {defaultCurrency}</td>
                                <td>{product.stock}</td>
                                <td>{product.qte_sold}</td>
                                <td className="actions-container">
                                    <button onClick={() => openModal(product)}><i className='bx bxs-edit'></i></button>
                                    <button onClick={() => handleDelete(product.id)}><i className='bx bx-trash'></i></button>
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
                        <h3>Add New Product</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Product Price"
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                            />
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Select Product Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
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
                        <h3>Edit Product</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                            />
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Select Product Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentProduct.id, newName, newPrice)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default Products