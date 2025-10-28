import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import { useUser } from '../context/UserContext';
import axios from "axios";
import {toast} from "react-toastify";



const NavBar = ({toggleBar,showBar}) => {
    const { user, loading } = useUser();
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const [showMenu, setShowMenu] = useState(false);


    const [systemInfo , setSystemInfo] = useState('');
    const [systemName, setSystemName] = useState('');
    const fetchSystemInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/settings/fetchSettings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSystemInfo(response.data);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        fetchSystemInfo();
    }, []);
    useEffect(() => {
        if (systemInfo?.system_name) {
            setSystemName(systemInfo.system_name);
        }
    }, [systemInfo])



    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    return(
        <nav>
            <i className={`bx ${showBar ? 'bx-x' : 'bx-menu'} menu-toggle-icon`} onClick={toggleBar}></i>
            <div className="logo-container"><img src="./logo2.png" alt="logo"/><span>{systemName}</span></div>
            <div className="profile" onClick={toggleMenu}>
                <img src="./profile.png" alt="profile"/>
            </div>
            <div className={`profile-menu ${showMenu ? 'visible' : ''}`}>
                <div className="profile-menu-user">
                    <ul>
                        <li><i className='bx bx-user'></i>{user?.fullname}</li>
                    </ul>
                </div>
                <div className="profile-menu-items">
                    <ul>
                      <Link to="/account"> <li><i className='bx bx-cog'></i>Account Settings</li></Link>
                        <Link to="/appinfo"><li><i className='bx bx-notepad'></i>App Info</li></Link>

                    </ul>
                </div>
                <div className="profile-menu-out">
                    <ul>
                        <li onClick={handleLogout}><i className='bx bx-power-off'></i>Sign Out</li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar