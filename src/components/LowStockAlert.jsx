import {Link} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";


const LowStockAlert = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);

    const fetchLowStock = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/products/fetchLowStock', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setLowStockProducts(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchLowStock();
    }, []);

  return(
      <div className="data-box">
          <div className="data-header">
              <h3>Low Stock Alert ( &lt; 100 )</h3>
              <Link to="/products">View All</Link>
          </div>
          <div className="product-table-container">
              <table className="product-table">
                  <thead>
                  <tr>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Stock</th>
                  </tr>
                  </thead>
                  <tbody>
                  {lowStockProducts.map((product, index) => (
                      <tr key={index}>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                          <td>{product.stock}</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
          </div>

  )
}

export default LowStockAlert