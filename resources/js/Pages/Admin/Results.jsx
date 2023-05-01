import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function scores(props) {
    let scoresList = props.scores.data;

    const [currentPage, setCurrentPage] = useState(1);
    const scoresPerPage = 10;

    const indexOfLastScore = currentPage * scoresPerPage;
    const indexOfFirstScore = indexOfLastScore - scoresPerPage;
    const currentScores = props.scores.data.slice(indexOfFirstScore, indexOfLastScore); 


    let onDeleteScore = async (id) => {
        if (window.confirm("Are you sure to delete this score?")) {
            try {
                await Inertia.post('/results/delete_score', { id: id })
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
                <div className='scoresList'>
                    <h3>Score List</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Score ID</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody style={{ display: scoresList.length > 0 ? 'ruby' : 'none' }}>
                            {currentScores.map((score,index) => (
                                <tr key={score.user_id}>
                                    <td>{index + 1}</td>
                                    <td>{score.id}</td>
                                    <td>{score.user_id}</td>
                                    <td>{score.score}</td>
                                    <td><button className='deleteQestionButton' onClick={() => onDeleteScore(score.id)}> Delete </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='flex justify-center mt-3'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        <div className='w-10 h-10 rounded-full bg-black text-white flex justify-center items-center mx-2'> { currentPage } </div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentScores.length < scoresPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>

                    <h3 className='' style={{ display: scoresList.length > 0 ? 'none' : 'block' }}>
                        No any Score !
                    </h3>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
