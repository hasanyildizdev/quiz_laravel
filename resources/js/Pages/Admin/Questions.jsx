import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';

export default function Questions(props) {

    let [questionID, setQuestionID] = useState('');
    let [question, setQuestion] = useState('');
    let [answer1, setAnswer1] = useState('');
    let [answer2, setAnswer2] = useState('');
    let [answer3, setAnswer3] = useState('');
    let [answer4, setAnswer4] = useState('');
    let [correct, setCorrect] = useState('');
    let [imageQuestion,setImageQuestion] = useState(null);
    let [imageA,setImageA] = useState(null);
    let [imageB,setImageB] = useState(null);
    let [imageC,setImageC] = useState(null);
    let [imageD,setImageD] = useState(null);

    let questionsList = props.questions.data;
    let answerList = props.answers.data;

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

    let onChangeImageQuestion = (e) => {
        setImageQuestion(e.target.files[0]);
    }
    let onChangeImageA = (e) => {
        setImageA(e.target.files[0]);
    }
    let onChangeImageB = (e) => {
        setImageB(e.target.files[0]);
    }
    let onChangeImageC = (e) => {
        setImageC(e.target.files[0]);
    }
    let onChangeImageD = (e) => {
        setImageD(e.target.files[0]);
    }

    let onSubmit = async (e) => {
        e.preventDefault();
        try {
            await Inertia.post('/questions/store', { 
                questionID: questionID,
                question : question,
                answer1 : answer1, 
                answer2 : answer2, 
                answer3 : answer3, 
                answer4 : answer4,
                correct : correct, 
                imageQuestion : imageQuestion,
                imageA : imageA,
                imageB : imageB,
                imageC : imageC,
                imageD : imageD
            });

            window.alert('Question created successfully.');
        } catch (error) {
            alert("Something went wrong! Error: " + error);
        }
    }

    onChangeQuestion = onChangeQuestion.bind(this);
    onChangeImageQuestion = onChangeImageQuestion.bind(this);
    onChangeA = onChangeA.bind(this);
    onChangeB = onChangeB.bind(this);
    onChangeC = onChangeC.bind(this);
    onChangeD = onChangeD.bind(this);
    onChangeImageA= onChangeImageA.bind(this);
    onChangeImageB= onChangeImageB.bind(this);
    onChangeImageC = onChangeImageC.bind(this);
    onChangeImageD = onChangeImageD.bind(this);
    onChangeCorrectAnswer = onChangeCorrectAnswer.bind(this);
    onSubmit = onSubmit.bind(this);

    let onDeleteQuestion = async (questionID) => {
        if (window.confirm("Are you sure to delete this question?")) {
            try {
                await Inertia.post('/questions/delete', { questionID: questionID })
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Questions</h2>}
            >
           <div className='admin_bg'>
                <div className='adminPanel'>
                    <Link href={'/'} style={{ textDecoration: 'none' }}>
                        Quiz
                    </Link>
                </div>
                <div className='admin_div'>
                    <h3 className=''>Add New Question</h3>
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
                                value={question}
                                onChange={onChangeQuestion}
                            />
                            <label htmlFor="imageQuestion" className='mr-2'>
                                <input id="imageQuestion" name="imageQuestion" type="file" onChange={onChangeImageQuestion} className="hidden" />
                            </label>                            
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 1'
                                type="text"
                                value={answer1}
                                onChange={onChangeA}
                            />
                            <label htmlFor="imageA" className='mr-2'>
                                <input id="imageA" name="imageA" type="file" onChange={onChangeImageA} className="hidden" />
                            </label>                            
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 2'
                                type="text"
                                value={answer2}
                                onChange={onChangeB}
                            />
                            <label htmlFor="imageB" className='mr-2'>
                                <input id="imageB" name="imageB" type="file" onChange={onChangeImageB} className="hidden" />
                            </label>                                 
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 3'
                                type="text"
                                value={answer3}
                                onChange={onChangeC}
                            />
                            <label htmlFor="imageC" className='mr-2'>
                                <input id="imageC" name="imageC" type="file" onChange={onChangeImageC} className="hidden" />
                            </label>     
                        </div>
                        <div className="form-group-admin">
                            <input
                                placeholder='Answer 4'
                                type="text"
                                value={answer4}
                                onChange={onChangeD}
                            />
                            <label htmlFor="imageD" className='mr-2'>
                                <input id="imageD" name="imageD" type="file" onChange={onChangeImageD} className="hidden" />
                            </label>                                 
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
                            <input type="submit" value="Add Question"/>
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
            </div>
        </AuthenticatedLayout>
    )
}
