import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/style.css'
import React from "react";
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';

export default function Ad(props) {

    let advertisementID = props.advertisement.data[0].question_id;
    let advertisementActive = props.advertisement.data[0].active;

    let [adNr, setAdNr] = useState('');
    let [isAdOn, setIsAdOn] = useState(advertisementActive);

    function handleToggle() {
        setIsAdOn(!isAdOn);
    }

    let onSubmitAd = async (e) => {
        e.preventDefault();
        try {
            await Inertia.post(route('ad.update'), {
                question_id: adNr || null,
                active: isAdOn,
            });
            window.alert('Addvertisment updated successfully.');
        } catch (error) {
            alert("Something went wrong! Error: " + error);
        }

    }

    let onChangeAdNR = (e) => {
        setAdNr(e.target.value);
    }
    
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advertisment</h2>}
            >
            <div className='admin_bg'>
                <div className='flex justify-center mt-10'>
                    <div className=' bg-gray-600 w-1/3 py-4 rounded-lg text-white'>
                        <h3 className='pb-4 flex justify-center'>Advertisement</h3>

                        <form className='flex flex-row justify-center items-center' onSubmit={onSubmitAd}>
                            <div className='flex flex-col  ml-4'>
                                <h4 className='pr-4 '>QuestionID: {advertisementID} </h4>
                                <h4 className='pr-4'>Active: {advertisementActive} </h4>
                            </div>
                            <div className="mx-auto pl-6 text-black">
                                <input
                                    placeholder='Question ID'
                                    type="number"
                                    required
                                    value={adNr}
                                    onChange={onChangeAdNR}
                                />
                            </div>
                            <div className='ml-auto mr-4'>
                                <input type="submit" value="Update" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"/>
                            </div>
                        </form>
                        
                        <div className='flex justify-center mt-5'>
                            <button className={`text-white font-bold mx-4 py-2 px-4 rounded-full inline-flex items-center ${isAdOn ? 'bg-green-500' : 'bg-red-500'} hover:scale-105`} onClick={handleToggle}>
                                <span className="mr-2">{isAdOn ? 'On' : 'Off'}</span>
                                <div className="relative">
                                    <input type="checkbox" id="toggle" className="sr-only" checked={isAdOn} onChange={handleToggle} />
                                    <label htmlFor="toggle" className="block w-10 h-6 rounded-full bg-white border-4"></label>
                                    <div className={`dot absolute w-4 h-4 rounded-full bg-gray-300 shadow-md left-1 top-1 transition ${isAdOn ? 'transform translate-x-5' : ''}`}></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
