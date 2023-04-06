import { Head, Link } from '@inertiajs/react';
import '../../../css/style.css'
import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function Admin(props) {

    let questionsList = props.questions.data;
    let answerList = props.answers.data;
    let userList = props.users.data;
    let advertisement = props.advertisement;

    console.log(advertisement);

    let [questionID, setQuestionID] = useState('');
    let [question, setQuestion] = useState('');
    let [answer1, setAnswer1] = useState('');
    let [answer2, setAnswer2] = useState('');
    let [answer3, setAnswer3] = useState('');
    let [answer4, setAnswer4] = useState('');
    let [correct, setCorrect] = useState('');

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

    let onSubmit = async (e) => {
        e.preventDefault();
        try {
            await Inertia.post(route('admin.store'), {
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
                await Inertia.post('/admin/delete', { questionID: questionID })
                alert("Deleted Successfully");
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    let onDeleteUser = async (userID) => {
        if (window.confirm("Are you sure to delete this user?")) {
            try {
                await Inertia.post('/admin/delete_user', { userID: userID })
                alert("Deleted Successfully");
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    return (
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
                             {userList.map((id, index) => (
                                <tr key={index}>
                                    <td>{userList[index].id}</td>
                                    <td>{userList[index].name}</td>
                                    <td>{userList[index].email}</td>
                                    <td>{userList[index].remember_token}</td>
                                    <td><button className='deleteQestionButton' onClick={() => onDeleteUser(userList[index].id)}> Delete </button></td>
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                    <h3 className='' style={{ display: userList.length > 0 ? 'none' : 'block' }}>
                        No any user !
                    </h3>
                </div>

                <div className='adminAdvertisement'>
                    <h3>Advertisement</h3>
                </div>
            </div>
        </>
    );
};