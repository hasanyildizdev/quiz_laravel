import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Wellcome to Admin Panel</div>
                    </div>
                    <div className='flex w-full h-fulljustify-center items-center gap-2 text-black mt-2'>
                        <div className='bg-blue-400 w-1/2 px-2 py-4 rounded text-center font-bold'>Total Users : {props.usersCount}</div>
                        <div className='bg-green-400 w-1/2 px-2 py-4 rounded text-center font-bold'>Total Questions : {props.questionsCount}</div>
                    </div>
                    <div className='flex w-full h-fulljustify-center items-center gap-2 text-black mt-2'>
                        <div className='bg-orange-400 w-1/2 px-2 py-4 rounded text-center font-bold'>Total Attempts : {props.attemptsCount}</div>
                        <div className=' w-1/2 px-2 py-4 rounded text-center font-bold' style={{background:props.advertisement ? '#00ff00' : '#ff0000'}}>Addvertisement : {props.advertisement ? ('Active') : ('Passive') }</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
