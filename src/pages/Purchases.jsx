import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import useSystemSettings from '../hooks/useSystemSettings';
import { jsPDF } from "jspdf";


function Purchases() {
    const { defaultCurrency, systemInfo } = useSystemSettings();

    const [text, setText] = useState('');
    const [filterSupplier, setFilterSupplier] = useState(null);

    const [purchases, setPurchases] = useState([]);


    const [newQuantity, setNewQuantity] = useState('');
    const [newTotal, setNewTotal] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPurchase, setCurrentPurchase] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    const [totalPurchases, setTotalPurchases] = useState(0);

    const openModal = (purchase) => {
        setCurrentPurchase(purchase);
        setSelectedSupplier(purchase.supplier);
        setSelectedProduct(purchase.product);
        setNewQuantity(purchase.quantity);
        setUnitPrice(purchase.unit_price)
        setNewTotal(purchase.total_price);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPurchase(null);
        setSelectedSupplier('');
        setSelectedProduct('');
        setNewQuantity('');
        setUnitPrice('')
        setNewTotal('');
    }

    // Select elements //
    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/suppliers/fetchSupplier', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuppliers(response.data);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchSuppliers();
    }, []);


    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/products/fetchProduct', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const quantityNum = parseFloat(newQuantity);
        const priceNum = parseFloat(unitPrice);

        if (!isNaN(quantityNum) && !isNaN(priceNum)) {
            setNewTotal((priceNum * quantityNum).toFixed(2));
        } else {
            setNewTotal('');
        }
    }, [newQuantity, unitPrice]);
    // Select elements end //


    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return `PCH-${randomNumber}`;
    };
    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!selectedSupplier || !selectedProduct || !newQuantity || !unitPrice) {
            toast.error("All fields are required.");
            return;
        }
        if (selectedSupplier.trim().length === 0) {
            toast.error("Supplier name cannot be empty");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5015/api/purchases/addPurchase', {code: newCode, supplier: selectedSupplier, product: selectedProduct, quantity: newQuantity, unit_price: unitPrice, total_price: newTotal},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchPurchases();
            toast.success(response.data.message);
        }catch{
            toast.error('Something went wrong');
        }
    }

    const fetchPurchases = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};

            if (filterSupplier) {
                params.supplierId = filterSupplier;
            }
            if (text) {
                params.searchText = text;
            }

            const response = await axios.get('http://localhost:5015/api/purchases/fetchPurchase', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });

            setPurchases(response.data);


            const total = response.data.reduce((sum, purchase) => sum + Number(purchase.total_price), 0);
            setTotalPurchases(total);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchPurchases();
    }, [filterSupplier, text]);

    const handleDelete = async (purchaseId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this purchase?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5015/api/purchases/deletePurchase/${purchaseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchPurchases();
            setPurchases(prev => prev.filter(pch => pch.id !== purchaseId));
            toast.success(response.data.message);

        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (purchaseId, selectedSuppplier, selectedProduct, newQuantity, unitPrice, newTotal) => {
        if (!selectedSupplier || !selectedProduct || !newQuantity || !unitPrice) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5015/api/purchases/updatePurchase/${purchaseId}`, {supplier: selectedSupplier, product: selectedProduct, quantity: newQuantity, unit_price: unitPrice, total_price: newTotal},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchPurchases();
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    const handleDownloadPurchase = (purchase) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Purchase Information", 20, 20);

        doc.setFontSize(12);
        doc.text(`Purchase Code: ${purchase.code}`, 20, 30);
        doc.text(`Date: ${(() => {
            const d = new Date(purchase.date.replace(' ', 'T'));
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
        })()}`, 20, 40);
        doc.text(`Supplier Name: ${purchase.supplier_name}`, 20, 50);
        doc.text(`Product Code: ${purchase.product_code}`, 20, 60);
        doc.text(`Quantity: ${purchase.quantity}`, 20, 70);
        doc.text(`Unit Price: ${purchase.unit_price} ${defaultCurrency}`, 20, 80);
        doc.text(`Total Price: ${purchase.total_price} ${defaultCurrency}`, 20, 90);

        doc.save(`${purchase.code}_purchase.pdf`);
    };

    useEffect(() => {
        document.title = 'Purchases';
    }, []);



    return (
        <>
            <HeaderTitle title="Purchases" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="data-header">
                        <div className="filter-container">
                            <select value={filterSupplier} onChange={(e) => {
                                setFilterSupplier(e.target.value);
                            }}>
                                <option value="">Filter Purchases by supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                        </div>
                        <h3>Total Purchases : {totalPurchases} {defaultCurrency}</h3>
                        <input
                            type="text"
                            placeholder="Search purchase by code"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Purchase Code</th>
                                <th>Date</th>
                                <th>Supplier</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td>{purchase.code}</td>
                                    <td>
                                        {(() => {
                                            const d = new Date(purchase.date.replace(' ', 'T'));
                                            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
                                        })()}
                                    </td>
                                    <td>{purchase.supplier_name}</td>
                                    <td>{purchase.product_code} <i className='bx bx-info-circle' title={purchase.product_name} style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}></i></td>
                                    <td>{purchase.quantity}</td>
                                    <td>{purchase.unit_price} {defaultCurrency}</td>
                                    <td>{purchase.total_price} {defaultCurrency}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(purchase)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(purchase.id)}><i className='bx bx-trash'></i></button>
                                        <button onClick={() => handleDownloadPurchase(purchase)}><i className='bx bx-download'></i></button>
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
                        <h3>Add Purchase</h3>
                        <div className="modal-inputs">
                            <select value={selectedSupplier} onChange={(e) => {
                                setSelectedSupplier(e.target.value);
                            }}>
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                            <select value={selectedProduct} onChange={(e) => {
                                setSelectedProduct(e.target.value);
                            }}>
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.code} | {product.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Quantity"
                                value={newQuantity}
                                onChange={e => setNewQuantity(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Unit Price"
                                value={unitPrice}
                                onChange={e => setUnitPrice(e.target.value)} />
                            <input
                                type="text"
                                placeholder="Total Price"
                                value={newTotal}
                                onChange={e => setNewTotal(e.target.value)}
                                disabled
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
                        <h3>Edit Purchase</h3>
                        <div className="modal-inputs">
                            <select value={selectedSupplier} onChange={(e) => {
                                setSelectedSupplier(e.target.value);
                            }}>
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                            <select value={selectedProduct} onChange={(e) => {
                                setSelectedProduct(e.target.value);
                            }}>
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.code} | {product.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Quantity"
                                value={newQuantity}
                                onChange={e => setNewQuantity(e.target.value)}
                            />
                            <input type="text"
                                   placeholder="Unit Price"
                                   value={unitPrice}
                                   onChange={e => setUnitPrice(e.target.value)} />
                            <input
                                type="text"
                                placeholder="Total Price"
                                value={newTotal}
                                onChange={e => setNewTotal(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentPurchase.id, selectedSupplier, selectedProduct, newQuantity, unitPrice, newTotal)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    )
}

export default Purchases