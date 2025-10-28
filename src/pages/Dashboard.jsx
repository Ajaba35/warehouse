import HeaderTitle from '../components/HeaderTitle.jsx';
import OverviewCard from "../components/OverviewCard.jsx";
import HighestSellingProducts from "../components/HighestSellingProducts.jsx";
import Top10CustomersChart from "../components/Top10CustomersChart.jsx";
import LowStockAlert from "../components/LowStockAlert.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import { useUser } from '../context/UserContext';
import {toast} from "react-toastify";
import useSystemSettings from '../hooks/useSystemSettings';


function Dashboard() {

    const { defaultCurrency, systemInfo } = useSystemSettings();
    const { user, loading } = useUser();
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);


    const fetchSales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/sales/fetchSale', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const total = response.data.reduce((sum, sale) => sum + Number(sale.total_price), 0);
            setTotalSales(total);
            const totalOrders = response.data.length;
            setTotalOrders(totalOrders);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/products/fetchProduct', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const totalProducts = response.data.length;
            setTotalProducts(totalProducts);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/customers/fetchCustomer', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const customerCount = response.data.length;
            setCustomerCount(customerCount);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    return (
        <>
            <HeaderTitle title={`Welcome, ${user?.fullname} !`} display="none" />
            <div className="overview-cards">
                <OverviewCard title="Total Sales" value={`${totalSales} ${defaultCurrency}`} growth="+15%" icon="bx bx-bar-chart-alt-2"/>
                <OverviewCard title="Total Orders" value={totalOrders} growth="+5.36%" icon="bx bxs-receipt"/>
                <OverviewCard title="Total Products" value={totalProducts} growth="+1.26%" icon="bx bxs-basket"/>
                <OverviewCard title="Total Customers" value={customerCount} growth="+20%" icon="bx bxs-user"/>
            </div>
            <div className="overview-charts">
                <HighestSellingProducts />
                <Top10CustomersChart />
            </div>
            <div className="general-data">
                <LowStockAlert/>
            </div>
        </>
    )
}

export default Dashboard

