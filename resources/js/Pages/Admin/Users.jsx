import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React, { useState } from "react";
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Users(props) {
    const { t } = useLaravelReactI18n();
    let userList = props.users.data;

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = props.users.data.slice(indexOfFirstUser, indexOfLastUser);

    let onDeleteUser = async (userID) => {
        if (window.confirm("Are you sure to delete this user?")) {
            try {
                await axios.post('/users/delete_user', { userID: userID })
                .then(response => { window.alert('Deleted Successfully'); window.location.reload();})
                .catch(error => { console.log(error); });
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight"> {t('users')} </h2>}
        >
            <div className='admin_bg'>

                <div className='userList'>
                    <h3>{t('user_list')}</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th> {t('id')} </th>
                                <th> {t('name')} </th>
                                <th> {t('email')} </th>
                            </tr>
                        </thead>
                        <tbody style={{ display: userList.length > 0 ? 'ruby' : 'none' }}>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => onDeleteUser(user.id)}> {t('delete')} </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='flex justify-center mt-3'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> {t('previous')} </button>
                        <div className='w-10 h-10 rounded-full bg-black text-white flex justify-center items-center mx-2'> { currentPage } </div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentUsers.length < usersPerPage} onClick={() => setCurrentPage(currentPage + 1)}> {t('next')} </button>
                    </div>

                    <h3 className='' style={{ display: userList.length > 0 ? 'none' : 'block' }}>
                        No any user !
                    </h3>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

