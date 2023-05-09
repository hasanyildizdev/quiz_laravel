
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React from "react";
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';

export default function Users(props) {

    let userList = props.users.data;

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = props.users.data.slice(indexOfFirstUser, indexOfLastUser);

    let onDeleteUser = async (userID) => {
        if (window.confirm("Are you sure to delete this user?")) {
            try {
                await Inertia.post('/users/delete_user', { userID: userID })
                alert("Deleted Successfully"); 
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <div className='admin_bg'>

                <div className='userList'>
                    <h3>Users List</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Remember_Token</th>
                            </tr>
                        </thead>
                        <tbody style={{ display: userList.length > 0 ? 'ruby' : 'none' }}>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.remember_token}</td>
                                    <td><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => onDeleteUser(user.id)}> Delete </button></td>
                                    <td><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Update </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='flex justify-center mt-3'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        <div className='w-10 h-10 rounded-full bg-black text-white flex justify-center items-center mx-2'> { currentPage } </div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentUsers.length < usersPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>

                    <h3 className='' style={{ display: userList.length > 0 ? 'none' : 'block' }}>
                        No any user !
                    </h3>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

