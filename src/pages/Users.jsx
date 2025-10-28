import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function Users() {

    const [users, setUsers] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [userCount, setUserCount] = useState(0);

    const openModal = (user) => {
        setCurrentUser(user);
        setNewName(user.fullname);
        setNewEmail(user.email);
        setNewRole(user.role);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setNewName('');
        setNewEmail('');
        setNewRole('');
    }


    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://warehouse-2riz.onrender.com/api/users/fetchUser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
            const userCount = response.data.length;
            setUserCount(userCount);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, []);


    const handleAdd = async () => {
        if (!newName || !newEmail || !newPassword || !newRole) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
                const response = await axios.post('https://warehouse-2riz.onrender.com/api/users/addUser', {fullname: newName, email: newEmail, password: newPassword, role: newRole},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers();
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    }

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://warehouse-2riz.onrender.com/api/users/deleteUser/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
                setUsers(prev => prev.filter(us => us.id !== userId));
            setUserCount(userCount);
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
        }
    };

    const handleEdit = async (userId, newName, newEmail, newPassword, newRole) => {
        if (!newName || !newEmail || !newRole) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://warehouse-2riz.onrender.com/api/users/updateUser/${userId}`, {fullname: newName, email: newEmail, password: newPassword, role: newRole},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(prev =>
                prev.map(us => us.id === userId ? { ...us, fullname: newName, email: newEmail, password: newPassword, role: newRole } : us)
            );
            toast.success(response.data.message);
        }catch (err){
            toast.error(err.response.data.message);
        }
    };

    useEffect(() => {
        document.title = 'Users';
    }, []);

    return (
        <>
            <HeaderTitle title="System Users" display="flex" onAddClick={() => setShowAddModal(true)}/>
            <div className="general-data">
                <div className="data-box">
                    <div className="data-header">
                        <h3>Total Users : {userCount}</h3>
                    </div>
                    <div className="product-table-container">

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joining Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users?.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.created_at}</td>
                                    <td className="actions-container">
                                        <button onClick={() => openModal(user)}><i className='bx bxs-edit'></i></button>
                                        <button onClick={() => handleDelete(user.id)}><i className='bx bx-trash'></i></button>
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
                        <h3>Add User</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <select
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
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
                        <h3>Edit User</h3>
                        <div className="modal-inputs">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                            />
                            <select
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => handleEdit(currentUser.id, newName, newEmail, newPassword, newRole)}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    )
}

export default Users