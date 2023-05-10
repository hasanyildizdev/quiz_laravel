import '../../../css/style.css'
import React, { useEffect, Component } from "react";
import { Link, Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

function withLaravelReactI18n(Component) {
    return function WrappedComponent(props) {
      const { t, setLang  } = useLaravelReactI18n();
      useEffect(() => {
            setLang(props.language);
        },[]);
    return <Component {...props} t={t}  />;
  };
}

class Result extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            total_score: props.total_score,
            correctCount: props.correct,
            wrongCount: props.wrong,
            noAnswerCount : props.noanswer,    
            points : props.points        
        }
    }
    
    render() {
        return (
            <>
                <Head title="Result" />
                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>

                    <div className='score'>
                        <h1> {this.state.total_score} </h1>
                        <p>  {this.props.t('score')}  </p>
                    </div>

                    {this.state.noAnswerCount === 0 ? (
                        <div className='flex justify-center items-center text-xl lg:text-2xl text-white mb-10 text-center px-4 lg:px-0'>
                           Great! You completed 7 questions today <br/>
                            You can see new questions tomorrow <br/>
                        </div>
                    ) : null}

                    <div className='answer_results'>
                        <div className='buttonResultWrong text-center'>
                            <div> {this.props.t('wrong')}: {this.state.wrongCount} </div>
                        </div>
                        <div className='buttonResultCorrect text-center'>
                            <div> {this.props.t('correct')}: {this.state.correctCount}  </div>
                        </div>
                    </div>


                    {this.state.noAnswerCount === 0 ? (
                        <div className='w-1/4 md:w-1/4 lg:w-1/7 mx-auto flex justify-center items-center text-center text:2xl lg:text-3xl py-2 lg:py-6 bg-green-400 mb-10 rounded-xl'>
                            <div className='text-sm md:text-xl lg:text-2xl'> Today Score : {this.state.points}  </div>
                        </div>
                    ) : null}

                    {this.state.noAnswerCount > 0 ? (
                        <div className='no_answer text-center'>
                            {this.props.t('unanswered')} : {this.state.noAnswerCount}
                        </div>
                    ) : null}
                    
                    {!this.props.user ? (
                        <div className='flex justify-center items-center mb-10 text-white text-xl lg:text-2xl px-4 lg:px-0'>
                             <p className='text-lg lg:text-2xl text-center'> Sign In to see your score on ScoreBoard </p>
                            <Link href={route('login')} style={{ textDecoration: 'none' }} >
                                <button className='loginButton mr-2 truncate'>{this.props.t('login')}</button>
                            </Link>
                        </div>
                    ) : null}


                    <div className='goMenuButtonDiv'>
                        <Link href={'/'} style={{ textDecoration: 'none' }}>
                            <button className='goMenuButton'>
                                {this.props.t('backtomenu')}
                            </button>
                        </Link>
                    </div>
                </div>
                </div>
            </>
        )
    }
}

export default withLaravelReactI18n(Result);