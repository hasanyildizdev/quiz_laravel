import '../../../css/style.css'
import React, { Component } from "react";
import { Link, Head } from '@inertiajs/react';

export default class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.total_score = this.props.total_score;
        this.completed_question_count = this.props.completed_question_count;
        this.remaining_question_count = this.props.remaining_question_count;
        this.quiz_completed = this.props.quiz_completed;
    }

    
    render() {
        
        function logout() {
            axios.post('/logout')
            .then(response => {
                console.log(response);
                window.location.href = '/';
            })
            .catch(error => {
                console.log(error);
            });
        }

        return (
            <>
                <Head title="Congratulations" />
                <div className="bg">

                    <div className='loginButtonDiv'>
                        <Link href={'/'} style={{ textDecoration: 'none' }}>
                            <button className='loginButton'>
                                <svg className='w-6 h-6 lg:w-8 lg:h-8' viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <path d="M14.389 7.956v4.374l1.056 0.010c7.335 0.071 11.466 3.333 12.543 9.944-4.029-4.661-8.675-4.663-12.532-4.664h-1.067v4.337l-9.884-7.001 9.884-7zM15.456 5.893l-12.795 9.063 12.795 9.063v-5.332c5.121 0.002 9.869 0.26 13.884 7.42 0-4.547-0.751-14.706-13.884-14.833v-5.381z" fill="#ffffff"></path>
                                </svg>
                            </button>
                        </Link>
                    </div>
                    
                    <div className='logoutButtonDiv'>
                        <button className='loginButton' onClick={logout}> Log Out </button>
                    </div>

                    <div className="row">
                        <div className='logo'>
                            <h1 className=' text-white text-xl lg:text-4xl'>QUIZ</h1>
                            <img src="img/logo.png" alt="Logo" />
                            <h1 className=' text-white text-xl lg:text-4xl'>TRADER</h1>
                        </div>
                    </div>

                    {!this.quiz_completed ? ( 
                        <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                            <h2 className='text-2xl lg:text-3xl text-center'> Wellcome {this.user.name} </h2>
                        </div>
                    ) : null } 

                    {this.quiz_completed ? (
                        <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                            <h2 className='text-xl lg:text-2xl text-center'>Congratulations! You completed all questions</h2>
                        </div>
                    ) : null}

                    {this.quiz_completed ? (
                        <div className='answer_results'>
                            <div className='buttonResultCorrect'>
                                <div className='text-xl lg:text-2xl text-center'> Total Score: {this.total_score} </div>
                            </div>
                        </div> 
                    ) : null}

                    {!this.quiz_completed ? (
                        <div className='answer_results'>
                            <div className='buttonResultCorrect text-center'>
                                Cozulen: { this.completed_question_count } 
                            </div>
                            <div className='buttonResultCorrect text-center'>
                                Kalan: { this.remaining_question_count } 
                            </div>
                        </div>
                    ) : null } 

                    <div className='goMenuButtonDiv'>
                        <Link href={'/'} style={{ textDecoration: 'none' }}>
                            <button className='goMenuButton'>
                                بازگشت به پروفایل
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        )
    }
}
