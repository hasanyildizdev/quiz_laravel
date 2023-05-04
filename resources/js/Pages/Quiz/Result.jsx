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
                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>

                    <div className='score'>
                        <h1> {this.state.score} </h1>
                        <p>  امتیاز  </p>
                    </div>

                    <div className='answer_results'>
                        <div className='buttonResultWrong text-center'>
                            <div> غلط: {this.state.wrongCount} </div>
                        </div>
                        <div className='buttonResultCorrect text-center'>
                            <div> درست: {this.state.correctCount}  </div>
                        </div>
                    </div>

                    <div className='no_answer text-center'>
                        بدون پاسخ: {this.state.noAnswerCount}
                    </div>

                    <div className='goMenuButtonDiv'>
                        <Link href={'/'} style={{ textDecoration: 'none' }}>
                            <button className='goMenuButton'>
                                بازگشت به منو
                            </button>
                        </Link>
                    </div>
                </div>
                </div>
            </>
        )
    }
}