import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Top10CustomersChart = () => {

    const [top10Customers, setTop10Customers] = useState([]);
    const fetchTopCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/sales/fetchTopCustomers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setTop10Customers(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchTopCustomers();
    }, []);

    const data = {
        labels: top10Customers.map(customer => customer.customer_name),
        datasets: [
            {
                label: 'Number of Sales',
                data: top10Customers.map(customer => customer.total_sales),
                backgroundColor: '#536eff',
                borderColor: '#536eff',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="top-10-customers-chart">
            <h3>Top 10 Customers</h3>
            <Bar data={data} />
        </div>
    )
}
export default Top10CustomersChart