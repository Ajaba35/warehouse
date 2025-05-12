import { Line } from 'react-chartjs-2';
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);



const HighestSellingProducts = () => {

    const [highestSellingProducts, setHighestSellingProducts] = useState([]);

    const fetchHighSelling = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5015/api/products/fetchHighSelling', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setHighestSellingProducts(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchHighSelling();
    }, []);

    const labels = highestSellingProducts.map(product => product.code);
    const dataValues = highestSellingProducts.map(product => product.qte_sold);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Quantity Sold',
                data: dataValues,
                fill: true,
                backgroundColor: '#536eff4a',
                borderColor: '#536eff',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };


    return(
        <div className="highest-selling-products-chart">
            <h3>Highest Selling Products</h3>
            <Line data={data} options={options} />
        </div>
    )
}

export default HighestSellingProducts
