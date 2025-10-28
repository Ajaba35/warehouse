import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Settings = () => {

    const [systemName, setSystemName] = useState('');
    const [defaultCurrency, setDefaultCurrency] = useState('');
    const [systemInfo , setSystemInfo] = useState('');

    const handleUpdate = async () => {
        if (!systemName || !defaultCurrency) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('https://warehouse-2riz.onrender.com/api/settings/updateSettings', {systemName:systemName, defaultCurrency:defaultCurrency},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(response.data.message);
        }catch (err){}
    }
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
        if (systemInfo?.default_currency) {
            setDefaultCurrency(systemInfo.default_currency);
        }
    }, [systemInfo])

    useEffect(() => {
        document.title = 'Settings';
    }, []);


    return (
        <>
            <HeaderTitle title="System Settings" display="none"/>
            <div className="general-data">
                <div className="data-box">
                    <div className="input-group">
                        <span>System Name</span>
                        <input
                            type="text"
                            value={systemName}
                            onChange={(e) => setSystemName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <span>Default Currency</span>
                        <select value={defaultCurrency} onChange={(e) => setDefaultCurrency(e.target.value)}>
                            <option value="MAD">Moroccan Dirham</option>
                            <option value="USD">$ - US Dollar</option>
                            <option value="EUR">€ - Euro</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <button onClick={() => handleUpdate()}>Save Changes</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Settings