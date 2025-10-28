import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useSystemSettings = () => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [defaultCurrency, setDefaultCurrency] = useState('');

    const fetchSystemInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/settings/fetchSettings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSystemInfo(response.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error fetching settings');
        }
    };

    useEffect(() => {
        fetchSystemInfo();
    }, []);

    useEffect(() => {
        if (systemInfo?.default_currency) {
            setDefaultCurrency(systemInfo.default_currency);
        }
    }, [systemInfo]);

    return { defaultCurrency, systemInfo };
};

export default useSystemSettings;
