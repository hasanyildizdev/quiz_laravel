import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link  } from '@inertiajs/react';
import '../../css/style.css'
import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function Dashboard(props) {

    let questionsList = props.questions.data;
    let answerList = props.answers.data;
    let userList = props.users.data;
    let advertisementID = props.advertisement.data[0].question_id;
    let advertisementActive = props.advertisement.data[0].active;

    let [questionID, setQuestionID] = useState('');
    let [question, setQuestion] = useState('');
    let [answer1, setAnswer1] = useState('');
    let [answer2, setAnswer2] = useState('');
    let [answer3, setAnswer3] = useState('');
    let [answer4, setAnswer4] = useState('');
    let [correct, setCorrect] = useState('');
    let [adNr, setAdNr] = useState('');
    let [isAdOn, setIsAdOn] = useState(advertisementActive);

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = props.users.data.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    function handleToggle() {
        setIsAdOn(!isAdOn);
    }

    let onChangeQuestionID = (e) => {
        setQuestionID(e.target.value);
    };
    let onChangeQuestion = (e) => {
        setQuestion(e.target.value);
    };
    let onChangeA = (e) => {
        setAnswer1(e.target.value);
    };
    let onChangeB = (e) => {
        setAnswer2(e.target.value);
    };
    let onChangeC = (e) => {
        setAnswer3(e.target.value);
    };
    let onChangeD = (e) => {
        setAnswer4(e.target.value);
    };
    let onChangeCorrectAnswer = (e) => {
        setCorrect(e.target.value);
    }
    let onChangeAdNR = (e) => {
        setAdNr(e.target.value);
    }

    let onSubmit = async (e) => {
        e.preventDefault();
        try {
            await Inertia.post(route('dashboard.store'), {
                questionID: questionID,
                question: question,
                answer1: answer1,
                answer2: answer2,
                answer3: answer3,
                answer4: answer4,
                correct: correct
            });
            window.alert('Question created successfully.');
        } catch (error) {
            alert("Something went wrong! Error: " + error);
        }

    }
    let onSubmitAd = async (e) => {
        e.preventDefault();
        try {
            await Inertia.post(route('dashboard.store_ad'), {
                question_id: adNr || null,
                active: isAdOn,
            });
            window.alert('Question created successfully.');
        } catch (error) {
            alert("Something went wrong! Error: " + error);
        }

    }

    onChangeQuestion = onChangeQuestion.bind(this);
    onChangeA = onChangeA.bind(this);
    onChangeB = onChangeB.bind(this);
    onChangeC = onChangeC.bind(this);
    onChangeD = onChangeD.bind(this);
    onChangeCorrectAnswer = onChangeCorrectAnswer.bind(this);
    onSubmit = onSubmit.bind(this);

    let onDeleteQuestion = async (questionID) => {
        if (window.confirm("Are you sure to delete this question?")) {
            try {
                await Inertia.post('/dashboard/delete', { questionID: questionID })
                alert("Deleted Successfully");
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    let onDeleteUser = async (userID) => {
        if (window.confirm("Are you sure to delete this user?")) {
            try {
                await Inertia.post('/dashboard/delete_user', { userID: userID })
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
            </div>

            <>
            <Head title="Admin" />
            
            <div className='admin_bg'>

                <div className='adminPanel'>
                    <Link href={'/'} style={{ textDecoration: 'none' }}>
                        Quiz
                    </Link>
                </div>
                <div className='admin_div'>
                    <h3>Add New Question</h3>
                    <form onSubmit={onSubmit}>
                        <div className="form-group-admin">
                            <input
                                placeholder='ID'
                                type="number"
                                required
                                value={questionID}
                                onChange={onChangeQuestionID}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Question'
                                type="text"
                                required
                                value={question}
                                onChange={onChangeQuestion}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 1'
                                type="text"
                                required
                                value={answer1}
                                onChange={onChangeA}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 2'
                                type="text"
                                required
                                value={answer2}
                                onChange={onChangeB}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 3'
                                type="text"
                                required
                                value={answer3}
                                onChange={onChangeC}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 4'
                                type="text"
                                required
                                value={answer4}
                                onChange={onChangeD}
                            />
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Correct Answer Number (1-4)'
                                type="number"
                                required
                                value={correct}
                                onChange={onChangeCorrectAnswer}
                            />
                        </div>

                        <div className="form-admin-submit-button">
                            <input type="submit" value="Add Question" />
                        </div>
                    </form>
                </div>

                <div className='flex justify-center mt-10'>
                        <div className=' bg-gray-600 w-1/3 py-4 rounded-lg text-white'>
                            <h3 className='pb-4 flex justify-center'>Advertisement</h3>

                            <form className='flex flex-row justify-center items-center text-black' onSubmit={onSubmitAd}>
                                <div className='flex flex-col  ml-4'>
                                   <h4 className='pr-4'>QuestionID: {advertisementID} </h4>
                                    <h4 className='pr-4'>Active: {advertisementActive} </h4>
                                </div>
                                <div className="mx-auto pl-6">
                                    <input
                                        placeholder='Question ID'
                                        type="number"
                                        required
                                        value={adNr}
                                        onChange={onChangeAdNR}
                                    />
                                </div>
                                <div className='ml-auto mr-4'>
                                    <input type="submit" value="Update" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"/>
                                </div>
                            </form>
                            
                            <div className='flex justify-center mt-5'>
                                <button className={`text-white font-bold mx-4 py-2 px-4 rounded-full inline-flex items-center ${isAdOn ? 'bg-green-500' : 'bg-red-500'} hover:scale-105`} onClick={handleToggle}>
                                    <span className="mr-2">{isAdOn ? 'On' : 'Off'}</span>
                                    <div className="relative">
                                        <input type="checkbox" id="toggle" className="sr-only" checked={isAdOn} onChange={handleToggle} />
                                        <label htmlFor="toggle" className="block w-10 h-6 rounded-full bg-white border-4"></label>
                                        <div className={`dot absolute w-4 h-4 rounded-full bg-gray-300 shadow-md left-1 top-1 transition ${isAdOn ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                <div className="questionList">
                    <h3>Question List</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Answer 1</th>
                                <th>Answer 2</th>
                                <th>Answer 3</th>
                                <th>Answer 4</th>
                            </tr>
                        </thead>
                        <tbody style={{ display: questionsList.length > 0 ? 'ruby' : 'none' }}>
                            {questionsList.sort((a, b) => a.question_id - b.question_id).map((q, index) => (
                                <tr key={index}>
                                    <td>{questionsList[index].question_id}</td>
                                    <td>{questionsList[index].text}</td>
                                    <td>{answerList.find((a) => a.question_id === index + 1 && a.option === 1)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === index + 1 && a.option === 2)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === index + 1 && a.option === 3)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === index + 1 && a.option === 4)?.text}</td>
                                    <td><button className='deleteQestionButton' onClick={() => onDeleteQuestion(questionsList[index].question_id)}> Delete </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 style={{ display: questionsList.length > 0 ? 'none' : 'block' }}>
                        No any question !
                    </h3>
                </div>

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
                        <tbody style={{ display: questionsList.length > 0 ? 'ruby' : 'none' }}>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.remember_token}</td>
                                    <td><button className='deleteQestionButton' onClick={() => onDeleteUser(userList[index].id)}> Delete </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                        <div className='flex justify-center'>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2' disabled={currentUsers.length < usersPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </div>
                    
                    <h3 className='' style={{ display: userList.length > 0 ? 'none' : 'block' }}>
                        No any user !
                    </h3>
                </div>

            </div>
        </>
        </AuthenticatedLayout>
    );
}
