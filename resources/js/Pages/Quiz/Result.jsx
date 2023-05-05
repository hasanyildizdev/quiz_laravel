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
            score: 0,
            correctCount: 0,
            wrongCount: 0
        }
    }

    async componentDidMount() {
/*         const urlParams = new URLSearchParams(window.location.search);
 */       /*  try {
            const response = await axios.get('/api/data');
            console.log(response.data);
          } catch (error) {
            console.error(error);
          } */
/*         this.setState({
            score: urlParams.get('score'),
            correctCount: urlParams.get('correct'),
            wrongCount: urlParams.get('wrong'),
            noAnswerCount: urlParams.get('noanswer'),
        }); */
    }

    
    render() {
        return (
            <>
                <Head title="Result" />
                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>

                    <div className='score'>
                        <h1> {this.state.score} </h1>
                        <p>  {this.props.t('score')}  </p>
                    </div>

                    <div className='answer_results'>
                        <div className='buttonResultWrong text-center'>
                            <div> {this.props.t('wrong')}: {this.state.wrongCount} </div>
                        </div>
                        <div className='buttonResultCorrect text-center'>
                            <div> {this.props.t('correct')}: {this.state.correctCount}  </div>
                        </div>
                    </div>

                    <div className='no_answer text-center'>
                        {this.props.t('unanswered')} : {this.state.noAnswerCount}
                    </div>

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