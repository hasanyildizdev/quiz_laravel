import '../../../css/style.css'
import React, { Component } from "react";
import { Link, Head } from '@inertiajs/react';

export default class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.total_score = this.props.total_score;
    }

    render() {

        return (
            <>
                <Head title="Congratulations" />
                <div className="bg">

                    <div className="row">
                        <div className='logo'>
                            <h1 className=' text-white text-xl lg:text-4xl'>QUIZ</h1>
                            <img src="img/logo.png" alt="Logo" />
                            <h1 className=' text-white text-xl lg:text-4xl'>TRADER</h1>
                        </div>
                    </div>

                    <div className='w-full flex justify-center text-green-400 text-2xl lg:text-3xl py-12 font-bold px-6 lg:px-0'>
                        <h2 className='text-xl lg:text-2xl text-center'>Wellcome {this.props.user} </h2>
                    </div>
                    
                    {this.total_score ? (
                        <div className='answer_results'>
                            <div className='buttonResultCorrect'>
                                <div className='text-xl lg:text-2xl text-center'> Total Score: {this.total_score} </div>
                            </div>
                        </div> 
                    ) : null}

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
