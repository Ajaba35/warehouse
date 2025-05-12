import {Link, NavLink} from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';


const SideBar = ({showBar}) => {
    const { user } = useUser('');
    return(
        <>
           <div className={`sidebar ${showBar ? 'visible' : 'hidden'}`}>
               <ul>
                   <Link to="/"><li><i className='bx bxs-dashboard'></i>Dashboard</li></Link>

                   <div className="sidebar-line"><span>management</span></div>
                   <NavLink className="side-links" to="/products"><li><i className='bx bxs-basket'></i>Products</li></NavLink>
                   <NavLink className="side-links" to="/categories"><li><i className='bx bxs-coin-stack'></i>Categories</li></NavLink>
                   <NavLink className="side-links" to="/sales"><li><i className='bx bxs-bar-chart-square'></i>Sales</li></NavLink>
                   <NavLink className="side-links" to="/purchases"><li><i className='bx bxs-cart-download'></i>Purchases</li></NavLink>
                   <NavLink className="side-links" to="/suppliers"><li><i className='bx bxs-store'></i>Suppliers</li></NavLink>
                   <NavLink className="side-links" to="/customers"><li><i className='bx bxs-user'></i>Customers</li></NavLink>

                   {user?.role === 'admin' && (
                       <>
                           <div className="sidebar-line"><span>admin area</span></div>
                           <NavLink className="side-links" to="/users">
                               <li><i className='bx bxs-user-account'></i>System Users</li>
                           </NavLink>
                           <NavLink className="side-links" to="/settings">
                               <li><i className='bx bxs-cog'></i>Settings</li>
                           </NavLink>
                       </>
                   )}

               </ul>
           </div>
        </>
    )
}

export default SideBar