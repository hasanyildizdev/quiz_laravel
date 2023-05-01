import '../../../css/style.css'
import React, { Component } from "react";
import { Link, Head } from '@inertiajs/react';

export default class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            correctCount: 0,
            wrongCount: 0
        }
    }

    async componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);

        this.setState({
            score: urlParams.get('score'),
            correctCount: urlParams.get('correct'),
            wrongCount: urlParams.get('wrong'),
            noAnswerCount: urlParams.get('noanswer'),
        });
    }

    
    render() {

        return (
            <>
                <Head title="Result" />
                <div className="bg">

                    <div className='loginButtonDiv'>
                        <Link href={route('login')} style={{ textDecoration: 'none' }}>
                            <button className='loginButton'>Sign In</button>
                        </Link>
                    </div>

                    <div className='score'>
                        <h1> {this.state.score} </h1>
                        <p>  سکه  </p>
                    </div>

                    <div className='answer_results'>
                        <div className='buttonResultWrong'>
                            <div> Yanlış: {this.state.wrongCount} </div>
                        </div>
                        <div className='buttonResultCorrect'>
                            <div> Doğru: {this.state.correctCount}  </div>
                        </div>
                    </div>

                    <div className='no_answer'>
                        Cevapsız: {this.state.noAnswerCount}
                    </div>

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