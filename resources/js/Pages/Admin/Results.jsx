import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function Results(props) {
    let resultsList = props.results.data;

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    const indexOfLastUser = currentPage * resultsPerPage;
    const indexOfFirstUser = indexOfLastUser - resultsPerPage;
    const currentUsers = props.results.data.slice(indexOfFirstUser, indexOfLastUser);


    let onDeleteUser = async (ID) => {
        if (window.confirm("Are you sure to delete this score?")) {
            try {
                await Inertia.post('/results/delete_score', { ID: ID })
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight"> Scores </h2>}
            >
            <div className='admin_bg'>
                <div className='resultsList'>
                    <h3>Score List</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody style={{ display: resultsList.length > 0 ? 'ruby' : 'none' }}>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.user_id}</td>
                                    <td>{user.score}</td>
                                    <td><button className='deleteQestionButton' onClick={() => onDeleteUser(user.id)}> Delete </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='flex justify-center mt-3'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        <div className='w-10 h-10 rounded-full bg-black text-white flex justify-center items-center mx-2'> { currentPage } </div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentUsers.length < resultsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>

                    <h3 className='' style={{ display: resultsList.length > 0 ? 'none' : 'block' }}>
                        No any user !
                    </h3>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
