import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import { useUser } from '../context/UserContext';
import axios from "axios";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Account = () => {

    const { user,email,password,role } = useUser('');
    const [fullName, setFullName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        if (user?.fullname) {
            setFullName(user.fullname);
        }
        if (user?.email) {
            setNewEmail(user.email);
        }
        if (user?.role) {
            setNewRole(user.role);
        }
    }, [user,email,password,role]);

    const handleUpdate = async (fullName,newEmail,NewPassword) => {
        if (!fullName || !newEmail ) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5015/api/users/updateMe', {fullname:fullName, email:newEmail, password:newPassword},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(response.data.message);
        }catch (err){

        }
    }

    useEffect(() => {
        document.title = 'Account';
    }, []);

    return (


        <>
            <HeaderTitle title="Account Settings" display="none"/>
            <div className="general-data">
                <div className="data-box">
                    <div className="input-group">
                         <span>Full Name</span>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <span>Email</span>
                        <input
                            type="text"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <span>Password</span>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div className="input-group">
                        <span>Role</span>
                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="input-group">
                        <button onClick={() => handleUpdate(fullName,newEmail,newPassword)}>Save Changes</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Account