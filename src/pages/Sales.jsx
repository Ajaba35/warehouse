import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import useSystemSettings from '../hooks/useSystemSettings';
import { jsPDF } from "jspdf";


function Sales() {
    const { defaultCurrency, systemInfo } = useSystemSettings();

    const [text, setText] = useState('');
    const [filterCustomer, setFilterCustomer] = useState(null);

    const [sales, setSales] = useState([]);


    const [newQuantity, setNewQuantity] = useState('');
    const [newTotal, setNewTotal] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSale, setCurrentSale] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customers, setCustomers] = useState([]);

    const [totalSales, setTotalSales] = useState(0);

    const openModal = (sale) => {
        setCurrentSale(sale);
        setSelectedCustomer(sale.customer);
        setSelectedProduct(sale.product);
        setNewQuantity(sale.quantity);
        setNewTotal(sale.total_price);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSale(null);
        setSelectedCustomer('');
        setSelectedProduct('');
        setNewQuantity('');
        setNewTotal('');
    }

    // Select elements //
    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/customers/fetchCustomer', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCustomers(response.data);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchCustomers();
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
        const selected = products.find(p => p.id === parseInt(selectedProduct));
        const quantityNum = parseInt(newQuantity);

        if (selected && !isNaN(quantityNum)) {
            setNewTotal((selected.price * quantityNum).toFixed(2));
        } else {
            setNewTotal('');
        }
    }, [selectedProduct, newQuantity, products]);
    // Select elements end //


    const generateCategoryCode = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return `SALE-${randomNumber}`;
    };
    const handleAdd = async () => {
        const newCode = generateCategoryCode();
        if (!selectedCustomer || !selectedProduct || !newQuantity) {
            toast.error("All fields are required.");
            return;
        }
        if (selectedCustomer.trim().length === 0) {
            toast.error("Customer name cannot be empty");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5015/api/sales/addSale', {code: newCode, customer: selectedCustomer, product: selectedProduct, quantity: newQuantity, total_price: newTotal},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchSales();
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message || 'Something went wrong');
        }
    }

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};

            if (filterCustomer) {
                params.customerId = filterCustomer;
            }
            if (text) {
                params.searchText = text;
            }

            const response = await axios.get('http://localhost:5015/api/sales/fetchSale', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });

            // Set the sales data to state
            setSales(response.data);

            // Calculate total sales price
            const total = response.data.reduce((sum, sale) => sum + Number(sale.total_price), 0);
            setTotalSales(total);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchSales();
    }, [filterCustomer, text]);

    const handleDelete = async (saleId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this sale?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5015/api/sales/deleteSale/${saleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchSales();
            setSales(prev => prev.filter(sale => sale.id !== saleId));
            toast.success(response.data.message);

        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (saleId, selectedCustomer, selectedProduct, newQuantity, newTotal) => {
        if (!selectedCustomer || !selectedProduct || !newQuantity) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5015/api/sales/updateSale/${saleId}`, {customer: selectedCustomer, product: selectedProduct, quantity: newQuantity, total_price: newTotal},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchSales();
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    const handleDownload = (sale) => {
        const doc = new jsPDF();


        doc.setFontSize(18);
        doc.text("Sale Information", 20, 20);


        doc.setFontSize(12);
        doc.text(`Sale Code: ${sale.code}`, 20, 30);
        doc.text(`Date: ${(() => {
            const d = new Date(sale.date.replace(' ', 'T'));
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
        })()}`, 20, 40);
        doc.text(`Customer Name: ${sale.customer_name}`, 20, 50);
        doc.text(`Product Code: ${sale.product_code}`, 20, 60);
        doc.text(`Quantity: ${sale.quantity}`, 20, 70);
        doc.text(`Total Price: ${sale.total_price} ${defaultCurrency}`, 20, 80);


        doc.save(`${sale.code}_sale.pdf`);
    };

    useEffect(() => {
        document.title = 'Sales';
    }, []);



    return (
        <>
            <HeaderTitle title="Sales" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="data-header">
                        <div className="filter-container">
                            <select value={filterCustomer} onChange={(e) => {
                                setFilterCustomer(e.target.value);
                            }}>
                                <option value="">Filter Sales by customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>
                        <h3>Total Sales : {totalSales} {defaultCurrency}</h3>
                        <input
                            type="text"
                            placeholder="Search sale by code"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Sale Code</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sales.map((sale) => (
                                <tr key={sale.id}>
                                    <td>{sale.code}</td>
                                    <td>
                                        {(() => {
                                            const d = new Date(sale.date.replace(' ', 'T'));
                                            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
                                        })()}
                                    </td>
                                    <td>{sale.customer_name}</td>
                                    <td>{sale.product_code} <i className='bx bx-info-circle' title={sale.product_name} style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}></i></td>
                                    <td>{sale.quantity}</td>
                                    <td>{sale.total_price} {defaultCurrency}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(sale)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(sale.id)}><i className='bx bx-trash'></i></button>
                                        <button onClick={() => handleDownload(sale)}><i className='bx bx-download'></i></button>
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
                        <h3>Add Sale</h3>
                        <div className="modal-inputs">
                            <select value={selectedCustomer} onChange={(e) => {
                                setSelectedCustomer(e.target.value);
                            }}>
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
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
                        <h3>Edit Sale</h3>
                        <div className="modal-inputs">
                            <select value={selectedCustomer} onChange={(e) => {
                                setSelectedCustomer(e.target.value);
                            }}>
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
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
                                placeholder="Total Price"
                                value={newTotal}
                                onChange={e => setNewTotal(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentSale.id, selectedCustomer, selectedProduct, newQuantity, newTotal)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    )
}

export default Sales