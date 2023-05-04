import '../../../css/style.css'
import React, { Component } from "react";
import { Link, Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

function withLaravelReactI18n(Component) {
  return function WrappedComponent(props) {
    const { t, tChoice } = useLaravelReactI18n();
    return <Component {...props} t={t} tChoice={tChoice} />;
  };
}

class Congratulations extends Component {

    constructor(props) {
        super(props);
        this.total_score = this.props.total_score;
    }

    render() {

        return (
            <>
                <Head title="Congratulations" />
                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>

                        <div className="row">
                            <div className='logo'>
                                <h1 className=' text-white text-xl lg:text-4xl'>{ this.props.t('quiz') }</h1>
                                <img src="img/logo.png" alt="Logo" />
                                <h1 className=' text-white text-xl lg:text-4xl'>{this.props.t('trader')}</h1>
                            </div>
                        </div>

                        <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                            <h2 className='text-xl lg:text-2xl text-center'>{this.props.t('congratulations')}</h2>
                        </div>

                        <div className='answer_results'>
                            <div className='buttonResultCorrect'>
                                <div className='text-xl lg:text-2xl text-center'> {this.props.t('totalpoints')} {this.total_score} </div>
                            </div>
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

export default withLaravelReactI18n(Congratulations);