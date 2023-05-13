import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React, { useEffect, useState } from "react";
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Questions(props) {
    const { t } = useLaravelReactI18n();

    let [questionID, setQuestionID] = useState(null);
    let [question, setQuestion] = useState('');
    let [answer1, setAnswer1] = useState('');
    let [answer2, setAnswer2] = useState('');
    let [answer3, setAnswer3] = useState('');
    let [answer4, setAnswer4] = useState('');
    let [correct, setCorrect] = useState('');
    let [imageQuestion, setImageQuestion] = useState(null);
    let [imageA, setImageA] = useState(null);
    let [imageB, setImageB] = useState(null);
    let [imageC, setImageC] = useState(null);
    let [imageD, setImageD] = useState(null);
    let [submit, setSubmit] = useState( 'Submit' );
    let [title, setTitle] = useState( 'Add New Question');
    let [isUpdate, setIsUpdate] = useState(false);
    
    useEffect(() =>{
        setIsUpdate(false);
    },[]);

    let questionsList = props.questions.data;
    let answerList = props.answers.data;
    let correctList = props.corrects.data;

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
            await axios.post('/questions/store', {
                question_id : questionID,
                is_update : isUpdate,
                question: question,
                answer1: answer1,
                answer2: answer2,
                answer3: answer3,
                answer4: answer4,
                correct: correct,
                imageQuestion: imageQuestion,
                imageA: imageA,
                imageB: imageB,
                imageC: imageC,
                imageD: imageD
            })
            .then(response => { window.alert('Successfull'); window.location.reload();})
            .catch(error => { console.log(error); });
        
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
    onChangeImageA = onChangeImageA.bind(this);
    onChangeImageB = onChangeImageB.bind(this);
    onChangeImageC = onChangeImageC.bind(this);
    onChangeImageD = onChangeImageD.bind(this);
    onChangeCorrectAnswer = onChangeCorrectAnswer.bind(this);
    onSubmit = onSubmit.bind(this);

    let onDeleteQuestion = async (questionID) => {
        if (window.confirm("Are you sure to delete this question?")) {
            try {
                await axios.post('/questions/delete', { questionID: questionID })
                .then(response => { window.alert('Deleted Successfully'); window.location.reload();})
                .catch(error => { console.log(error); });
            } catch (error) {
                alert("Something went wrong! Error: " + error);
            }
        }
    }

    function addNewQuestion() {
        let form = document.getElementById('question_form');
        let svg = document.getElementById('add_svg');
        if (form.style.display === "none") {
            form.style.display = "block";
            svg.style.display = "none";
        } else {
            form.style.display = "none";
            svg.style.display = "block";
        }
    }

    let onUpdateQuestion = async (id,question, answer1, answer2, answer3, answer4, correct) => {
        setQuestionID(id);
        setIsUpdate(true);
        let form = document.getElementById('question_form');
        let svg = document.getElementById('add_svg');
        form.style.display = "block";
        svg.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
        onChangeQuestion({target:{value:question}});
        onChangeA({target:{value : answer1}});
        onChangeB({target:{value : answer2}});
        onChangeC({target:{value : answer3}});
        onChangeD({target:{value : answer4}});
        onChangeCorrectAnswer({target:{value : correct}});
        setSubmit('Update');
        setTitle('Update Question');
        let new_question_add_button = document.getElementById('new_question_add_button');
        new_question_add_button.style.display = "block";
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={ <h2 className="font-semibold text-xl text-gray-800 leading-tight"> { t('questions') } </h2> }>

            <div className='admin_bg'>
                <div className='flex flex-col'>
                    <div className='flex  items-center'>
                        <button className='flex justify-center items-center text-white py-2 px-4 font-bold bg-blue-500 hover:bg-blue-700 rounded' onClick={addNewQuestion}>
                            <p id='add_question_text' className='text-white'> {title} </p> 
                            <svg id='add_svg' className='w-10 h-10  pr-2' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path id="Vector" d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button id='new_question_add_button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4' onClick={() => {window.location.href='/questions'}} style={{display:'none'}}> {t('add_new_question')} </button>
                    </div>
                    <form id='question_form' onSubmit={onSubmit} style={{ display: 'none' }} className='w-full '>
                        <div className="form-group-admin relative h-12 mr-4 " style={{ width: '80%' }}>
                            <input
                                placeholder= { t('question') }
                                type="text"
                                value={question}
                                onChange={onChangeQuestion}
                            />
                            <label htmlFor="imageQuestion" className='absolute left-0 w-1/6'>
                                <input id="imageQuestion" name="imageQuestion" type="file" onChange={onChangeImageQuestion} className="hidden" />
                            </label>
                        </div>
                        <div className='flex'>
                            <div className="form-group-admin  relative h-12 mx-2">
                            <div className=' w-6 h-6 bg-black text-white rounded-full text-center'>1</div>
                                <input
                                    placeholder= { t('answer') + ' 1'}
                                    type="text"
                                    value={answer1}
                                    onChange={onChangeA}
                                />
                                <label htmlFor="imageA" className='absolute left-0 w-1/3'>
                                    <input id="imageA" name="imageA" type="file" onChange={onChangeImageA} className="hidden" />
                                </label>
                            </div>
                            <div className="form-group-admin  relative h-12">
                                <div className=' w-6 h-6 bg-black text-white rounded-full text-center'>2</div>
                                <input
                                    placeholder= { t('answer') + ' 2'}
                                    type="text"
                                    value={answer2}
                                    onChange={onChangeB}
                                />
                                <label htmlFor="imageB" className='absolute left-0 w-1/3'>
                                    <input id="imageB" name="imageB" type="file" onChange={onChangeImageB} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className="form-group-admin relative h-12 mx-2">
                                <div className=' w-6 h-6 bg-black text-white rounded-full text-center'>3</div>
                                <input
                                    placeholder= { t('answer') + ' 3'}
                                    type="text"
                                    value={answer3}
                                    onChange={onChangeC}
                                />
                                <label htmlFor="imageC" className='absolute left-0 w-1/3'>
                                    <input id="imageC" name="imageC" type="file" onChange={onChangeImageC} className="hidden" />
                                </label>
                            </div>
                            <div className="form-group-admin relative h-12">
                                <div className=' w-6 h-6 bg-black text-white rounded-full text-center'>4</div>
                                <input
                                    placeholder= { t('answer') + ' 4'}
                                    type="text"
                                    value={answer4}
                                    onChange={onChangeD}
                                />
                                <label htmlFor="imageD" className='absolute left-0 w-1/3'>
                                    <input id="imageD" name="imageD" type="file" onChange={onChangeImageD} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className="form-admin-submit-button ml-2">
                                <input id='submit_button' type="submit" value={submit} />
                            </div>
                            <div className="form-group-admin" style={{ width: '260px' }}>
                                <input
                                    placeholder={ t('correct_answer_nr') + ' (1-4)'}
                                    type="number"
                                    required
                                    value={correct}
                                    onChange={onChangeCorrectAnswer}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="questionList">
                    <p> {t('questions_list')} </p>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th> NR </th>
                                <th> { t('questions') } </th>
                                <th> { t('answer') } 1 </th>
                                <th> { t('answer') } 2 </th>
                                <th> { t('answer') } 3 </th>
                                <th> { t('answer') } 4 </th>
                                <th> { t('correct') } </th>
                            </tr>
                        </thead>
                        <tbody style={{ display: questionsList.length > 0 ? 'ruby' : 'none' }}>
                            {questionsList.sort((a, b) => a.id - b.id).map((q, index) => (
                                <tr key={index}>
                                    <td> {index + 1} </td>
                                    <td>{questionsList[index].text}</td>
                                    <td>{answerList.find((a) => a.question_id === questionsList[index].id && a.option === 1)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === questionsList[index].id && a.option === 2)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === questionsList[index].id && a.option === 3)?.text}</td>
                                    <td>{answerList.find((a) => a.question_id === questionsList[index].id && a.option === 4)?.text}</td>
                                    <td> {correctList.find((a) => a.question_id === questionsList[index].id)?.correct_answer_id} </td>
                                    <td><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2' onClick={() => onDeleteQuestion(questionsList[index].id)}> { t('delete') } </button></td>
                                    <td><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
                                        onClick={() => onUpdateQuestion(
                                            questionsList[index].id,
                                            questionsList[index].text, 
                                            answerList.find((a) => a.question_id === questionsList[index].id && a.option === 1)?.text,
                                            answerList.find((a) => a.question_id === questionsList[index].id && a.option === 2)?.text,
                                            answerList.find((a) => a.question_id === questionsList[index].id && a.option === 3)?.text,
                                            answerList.find((a) => a.question_id === questionsList[index].id && a.option === 4)?.text,
                                            correctList.find((a) => a.question_id === questionsList[index].id)?.correct_answer_id
                                        )}>  { t('edit') }  </button></td>
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
