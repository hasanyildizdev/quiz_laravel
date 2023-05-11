import '../../../css/style.css'
import React, { useEffect,  Component } from "react";
import { Link, Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

function withLaravelReactI18n(Component) {
  return function WrappedComponent(props) {
    const { t, setLang  } = useLaravelReactI18n();
    useEffect(() => {
          setLang(props.language);
      },[]);
    return <Component {...props} t={t} />;
  };
}

class MyProfile extends Component {

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
                <Head title="Profile"/>
                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>
                        <div className='loginButtonDiv'>
                            <Link href={'/'} style={{ textDecoration: 'none' }}>
                                <button className='loginButton'>
                                    <svg className='w-6 h-6 lg:w-8 lg:h-8' viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <path d="M14.389 7.956v4.374l1.056 0.010c7.335 0.071 11.466 3.333 12.543 9.944-4.029-4.661-8.675-4.663-12.532-4.664h-1.067v4.337l-9.884-7.001 9.884-7zM15.456 5.893l-12.795 9.063 12.795 9.063v-5.332c5.121 0.002 9.869 0.26 13.884 7.42 0-4.547-0.751-14.706-13.884-14.833v-5.381z" fill="#ffffff"></path>
                                    </svg>
                                </button>
                            </Link>
                        </div>

                        <div className='logoutButtonDiv flex'>
                            <button className='loginButton' onClick={()=>{window.location.href = '/profile'; }}>
                                <svg className='w-6 h-6 lg:w-8 lg:h-8 ' viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 11H10V10H11V11Z" fill="#ffffff"/>
                                    <path d="M8 11H9V10H8V11Z" fill="#ffffff"/>
                                    <path d="M13 11H12V10H13V11Z" fill="#ffffff"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3 6V3.5C3 1.567 4.567 0 6.5 0C8.433 0 10 1.567 10 3.5V6H11.5C12.3284 6 13 6.67157 13 7.5V8.05001C14.1411 8.28164 15 9.29052 15 10.5C15 11.7095 14.1411 12.7184 13 12.95V13.5C13 14.3284 12.3284 15 11.5 15H1.5C0.671573 15 0 14.3284 0 13.5V7.5C0 6.67157 0.671573 6 1.5 6H3ZM4 3.5C4 2.11929 5.11929 1 6.5 1C7.88071 1 9 2.11929 9 3.5V6H4V3.5ZM8.5 9C7.67157 9 7 9.67157 7 10.5C7 11.3284 7.67157 12 8.5 12H12.5C13.3284 12 14 11.3284 14 10.5C14 9.67157 13.3284 9 12.5 9H8.5Z" fill="#ffffff"/>
                                </svg>
                            </button>
                            <button className='loginButton mr-2' onClick={logout}> {this.props.t('logout')} </button>
                        </div>

                        <div className="row">
                            <div className='logo'>
                                <h1 className=' text-white text-lg md:text-xl lg:text-4xl'>{this.props.t('trader')}</h1>
                                <img src="img/logo.png" alt="Logo" />
                                <h1 className=' text-white text-lg md:text-xl lg:text-4xl'>{this.props.t('quiz')}</h1>
                            </div>
                        </div>

                        {!this.quiz_completed ? (
                            <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                                <h2 className='text-2xl lg:text-3xl text-center'> {this.props.t('welcome')} {this.user.name} </h2>
                            </div>
                        ) : null}

                        {this.quiz_completed ? (
                            <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                                <h2 className='text-xl lg:text-2xl text-center'>{this.props.t('congratulations')}</h2>
                            </div>
                        ) : null}

                        {this.quiz_completed || true ? (
                            <div className='answer_results'>
                                <div className='buttonResultCorrect'>
                                    <div className='md:text-xl lg:text-2xl text-center'>{this.props.t('totalpoints')} {this.total_score} </div>
                                </div>
                            </div>
                        ) : null}

                        {!this.quiz_completed ? (
                            <div className='answer_results'>
                                <div className='buttonResultCorrect text-center'>
                                    {this.props.t('solved')} {this.completed_question_count}
                                </div>
                                <div className='buttonResultCorrect text-center'>
                                   {this.props.t('remain')} {this.remaining_question_count}
                                </div>
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

export default withLaravelReactI18n(MyProfile);