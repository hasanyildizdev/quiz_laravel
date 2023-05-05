import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/style.css';
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Welcome(props, { auth }) {
    const { t, setLang  } = useLaravelReactI18n();

    let scoreList = props.scores.data;
    let language = props.language;

    useEffect(() => {
        const persian_icon = document.querySelector('#persian_icon');
        const english_icon = document.querySelector('#english_icon');
        if(language === 'fa') {
            setLang('fa');
            english_icon.style.display = 'block';
            persian_icon.style.display = 'none';
        }else if(language === 'en') {
            setLang('en');
            persian_icon.style.display = 'block';
            english_icon.style.display = 'none';
        }
    },[]);

    const [showGuideAlert, setShowGuideAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showShareAlert, setShowShareAlert] = useState(false);

    const handleGuideAlertClick = () => {
        setShowGuideAlert(!showGuideAlert);
    }

    const handleScoreAlertClick = () => {
        setShowScoreAlert(!showScoreAlert);
    }

    const handleShareAlertClick = () => {
        setShowShareAlert(!showShareAlert);
    }

    const handleCopyClick = () => {
        const input = document.querySelector('input[name="telegramURL"]');
        input.select();
        document.execCommand("copy");

        const alertMessage = document.createElement("div");
        alertMessage.classList.add("alert-message");
        alertMessage.innerText = "کپی شد";
        document.body.appendChild(alertMessage);

        // Remove the alert message after a delay
        setTimeout(() => {
            alertMessage.remove();
        }, 3000);
    }

    const changeLanguage = async () =>{
        const persian_icon = document.querySelector('#persian_icon');
        const english_icon = document.querySelector('#english_icon');
        if (english_icon.style.display !== 'none') {
            persian_icon.style.display = 'block';
            english_icon.style.display = 'none';
            setLang('en');
            await axios.post('/set_language', { language: 'en' })
                .then(response => { console.log(response.data.message); })
                .catch(error => { console.log(error); });
        } else {
            english_icon.style.display = 'block';
            persian_icon.style.display = 'none';
            setLang('fa');
            await axios.post('/set_language', { language: 'fa' })
                .then(response => { console.log(response.data.message); })
                .catch(error => { console.log(error); });
        } 
    }

    return (
        <>
            <Head title="Welcome" />

            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">

                <div className="bg flex items-center">
                    <div className='w-full h-full pb-24'>

                        <div className='absolute left-2 top-2'>
                            <div id="english_icon" className='w-6 h-6 lg:w-10 lg:h-10 hover:scale-105 cursor-pointer' onClick={changeLanguage}>
                                <img src="img/en.webp" alt='English' className=' object-contain'/>
                            </div> 
                            <div id="persian_icon" className='w-6 h-6 lg:w-10 lg:h-10 hover:scale-105 cursor-pointer hidden' onClick={changeLanguage}>
                                <img src="img/fa.webp" alt='Persian' className=' object-contain'/>
                            </div>
                        </div>

                        <div className='loginButtonDiv'>
                            {props.user ? (
                                <Link href={'/myprofile'} style={{ textDecoration: 'none' }}>
                                    <button className='loginButton text-center'>{props.user.name}</button>
                                </Link>
                            ) : (
                                <Link href={route('login')} style={{ textDecoration: 'none' }}>
                                    <button className='loginButton'>{t('login')}</button>
                                </Link>
                            )}
                        </div>

                        <div className="row">
                            <div className='logo'>
                                <h1 className=' text-white text-xl lg:text-4xl'>{t('trader')}</h1>
                                <img src="img/logo.png" alt="Logo" />
                                <h1 className=' text-white text-xl lg:text-4xl'>{t('quiz')}</h1>
                            </div>
                        </div>

                        <div className='text purpleStyle'>
                            <p className='py-2'>
                                {t('telegram_registers')}
                            </p>
                        </div>

                        <div className="twoButtons">
                            <button className='buttonTwo purpleStyle' onClick={handleScoreAlertClick}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 21H9V12.6C9 12.2686 9.26863 12 9.6 12H14.4C14.7314 12 15 12.2686 15 12.6V21Z" stroke="#fff"></path>
                                    <path d="M20.4 21H15V18.1C15 17.7686 15.2686 17.5 15.6 17.5H20.4C20.7314 17.5 21 17.7686 21 18.1V20.4C21 20.7314 20.7314 21 20.4 21Z" stroke="#fff"></path>
                                    <path d="M9 21V16.1C9 15.7686 8.73137 15.5 8.4 15.5H3.6C3.26863 15.5 3 15.7686 3 16.1V20.4C3 20.7314 3.26863 21 3.6 21H9Z" stroke="#fff"></path>
                                    <path d="M10.8056 5.11325L11.7147 3.1856C11.8314 2.93813 12.1686 2.93813 12.2853 3.1856L13.1944 5.11325L15.2275 5.42427C15.4884 5.46418 15.5923 5.79977 15.4035 5.99229L13.9326 7.4917L14.2797 9.60999C14.3243 9.88202 14.0515 10.0895 13.8181 9.96099L12 8.96031L10.1819 9.96099C9.94851 10.0895 9.67568 9.88202 9.72026 9.60999L10.0674 7.4917L8.59651 5.99229C8.40766 5.79977 8.51163 5.46418 8.77248 5.42427L10.8056 5.11325Z" stroke="#fff"></path>
                                </svg>
                                {t('scoreboard')}
                            </button>
                            <button className='buttonTwo purpleStyle' onClick={handleGuideAlertClick}>
                                <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="#fff"></path>
                                    <path d="M10.7083 4.70969C8.87828 3.71969 6.10828 2.83969 4.22828 2.67969H4.15828C2.95828 2.67969 1.98828 3.64969 1.98828 4.84969V16.7397C1.98828 17.7097 2.77828 18.5997 3.74828 18.7197L4.05828 18.7597C5.69828 18.9797 8.00828 19.6597 9.86828 20.4397C10.5183 20.7097 11.2383 20.2197 11.2383 19.5097V5.59969C11.2383 5.21969 11.0383 4.88969 10.7083 4.70969ZM4.99828 7.73969H7.24828C7.65828 7.73969 7.99828 8.07969 7.99828 8.48969C7.99828 8.90969 7.65828 9.23969 7.24828 9.23969H4.99828C4.58828 9.23969 4.24828 8.90969 4.24828 8.48969C4.24828 8.07969 4.58828 7.73969 4.99828 7.73969ZM7.99828 12.2397H4.99828C4.58828 12.2397 4.24828 11.9097 4.24828 11.4897C4.24828 11.0797 4.58828 10.7397 4.99828 10.7397H7.99828C8.40828 10.7397 8.74828 11.0797 8.74828 11.4897C8.74828 11.9097 8.40828 12.2397 7.99828 12.2397Z" fill="#fff"></path>
                                </svg>
                                {t('game_guide')}
                            </button>
                        </div>

                        <div className='friends'>
                            <button className='friendsButton' onClick={handleShareAlertClick}>
                                <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 125">
                                    <path d="M81.589,26.73c4.063,1.865,8.375,3.901,8.443,3.933c0.651,0.308,1.342,0.454,2.019,0.454c1.769,0,3.464-1,4.271-2.706 c1.114-2.359,0.107-5.176-2.252-6.29c-0.177-0.083-1.887-0.891-4.129-1.937C88.1,23.305,85.13,25.678,81.589,26.73z"></path> <path d="M31.722,31.119c0.677,0,1.364-0.146,2.016-0.456c0.067-0.031,4.281-2.022,8.305-3.871 c-3.594-0.998-6.623-3.346-8.515-6.467c-2.09,0.977-3.66,1.717-3.826,1.796c-2.36,1.115-3.368,3.932-2.255,6.29 C28.253,30.118,29.952,31.119,31.722,31.119z"></path>
                                    <circle cx="77.732" cy="13.092" r="13.092"></circle> <circle cx="46.158" cy="13.092" r="13.092"></circle>
                                    <path d="M96.86,34.783c-0.011-0.012-0.022-0.02-0.034-0.031l-1.228-1.469l-1.115-1.116c-0.801,0.421-1.696,0.665-2.629,0.665 c-0.84,0-1.656-0.183-2.421-0.544c-0.07-0.034-5.329-2.518-9.703-4.511l-2.001,1.83l-2.641-2.487 c-0.547-0.092-1.085-0.209-1.61-0.361c-1.091,0.495-2.391,1.17-3.734,1.963c0.099-0.578,0.095-1.163-0.021-1.732 c0.598-0.348,1.186-0.668,1.762-0.973c-3.082-1.408-5.579-3.864-7.046-6.913c-0.812,0.494-1.609,0.998-2.369,1.513 c-1.111-0.637-2.183-1.244-3.025-1.721c-1.421,3.076-3.884,5.565-6.939,7.021c2.5,1.302,8.585,4.673,10.274,5.864 c0.369,0.26,0.769,0.439,1.176,0.581v24.643c0,2.118,0.34,4.133,0.976,5.973c-0.019,0.196-0.029,0.394-0.029,0.593v5.535h0.035 c-0.002,0.081-0.022,0.155-0.022,0.237l0.003,48.669c0,3.316,2.688,6.006,6.007,6.006c3.316,0,6.007-2.689,6.007-6.007 l-0.004-48.67c0-0.081-0.021-0.155-0.023-0.235h0.903c-0.004,0.079-0.024,0.154-0.024,0.234l-0.003,48.67 c0,3.316,2.688,6.006,6.006,6.007c3.317,0,6.006-2.688,6.006-6.006l0.006-48.669c0-0.082-0.021-0.156-0.025-0.236h0.146 c0.449,0.881,1.157,1.643,2.093,2.149c0.772,0.42,1.604,0.619,2.425,0.619c1.804,0,3.549-0.96,4.47-2.654 C107.712,52.291,102.694,41.149,96.86,34.783z M91.566,60.169l0.294-15.055C93.621,48.433,94.403,53.162,91.566,60.169z"></path>
                                    <path d="M50.155,26.694c-0.456,0.14-0.922,0.258-1.396,0.354l-2.717,2.559l-2.002-1.831c-4.376,1.994-9.633,4.478-9.706,4.511 c-0.765,0.361-1.577,0.544-2.42,0.544c-0.931,0-1.826-0.243-2.625-0.665l-1.951,2.123c-0.059,0.057-0.126,0.101-0.181,0.161 c-5.833,6.365-10.852,17.508-1.643,34.437c0.921,1.694,2.666,2.655,4.469,2.655c0.82,0,1.654-0.199,2.424-0.619 c0.811-0.442,1.436-1.083,1.886-1.817h0.087c-0.001,0.049-0.014,0.094-0.014,0.145l0.002,48.669c0,3.317,2.688,6.006,6.005,6.006 c3.318,0,6.008-2.688,6.008-6.007l-0.002-48.669c0-0.05-0.013-0.095-0.014-0.144h0.885c-0.001,0.049-0.016,0.094-0.016,0.144 l-0.004,48.669c0,3.318,2.688,6.007,6.007,6.007s6.007-2.688,6.007-6.006l0.004-48.669c0-0.049-0.013-0.096-0.014-0.145h0.035 v-5.533c0-0.201-0.012-0.398-0.031-0.595c0.638-1.84,0.978-3.854,0.978-5.973V31.66c-1.159-0.008-2.274-0.363-3.225-1.033 C54.685,29.001,52.06,27.545,50.155,26.694z M31.869,45.369v2.472l0.273,11.183C29.834,52.855,30.386,48.515,31.869,45.369z"></path>
                                </svg>
                                {t('introduce_friends')}
                            </button>
                        </div>

                        <div className='playButtonDiv'>
                            <button className='playButton'>
                                <Link href={'/quiz'} style={{ textDecoration: 'none' }}>
                                    <div className='playInside'>
                                        <div className='playSub'>
                                            <img src="img/game_controller.webp" alt="Play" />
                                            <p>{t('play')}</p>
                                        </div>
                                        <div className='playArrow'>
                                            <img src="img/play.webp" alt="Play" />
                                        </div>
                                    </div>
                                </Link>
                            </button>
                        </div>

                        <div className={`purpleStyle alert ${showScoreAlert ? 'show' : ''}`}>
                            <h2>{t('scoreboard')}</h2>

                            <table className="w-full mb-12 mb-12 md:mb-16 lg:mb-18">
                                <thead>
                                    <tr className="text-white text-center">
                                        <th className="px-2 py-3">#</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider"> {t('userid')} </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider">{t('score')}</th>
                                    </tr>
                                </thead>
                                <tbody style={{ display: scoreList.length > 0 ? 'ruby' : 'none' }}>
                                    {scoreList.map((user, index) => (
                                        <tr key={user.user_id} className="text-white text-center">
                                            <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{scoreList[index].user_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{scoreList[index].score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className='alertSubButton' onClick={handleScoreAlertClick}>{t('okay')}</button>
                        </div>


                        <div className={`purpleStyle alert ${showGuideAlert ? 'show' : ''}`}>
                            <h2> {t('game_guide')} </h2>
                            <p>
                                {t('game_rules')} <br />
                                1 - {t('clicktostart')} <br />
                                2 - {t('answercorrectly')} <br />
                                3 - {t('getcoinspoints')}<br />
                                4 - {t('waitforprize')}
                            </p>
                            <button className='alertSubButton' onClick={handleGuideAlertClick}>{t('okay')}</button>
                        </div>

                        <div className={`purpleStyle alert ${showShareAlert ? 'show' : ''}`}>
                            <h2> {t('introduce_friends')}</h2>
                            <p>
                                {t('introuceandgain')} <br />
                                {t('sharingbelowlink')}<br />
                                {t('enterrobotclick')} <br />
                                <br />
                                <strong> {t('introduction_link')}</strong>
                            </p>

                            <button id='copyClipboard' className='shareDiv' onClick={handleCopyClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                <input type="text" name="telegramURL" readOnly defaultValue="https://t.me/AdamAppBot?start=5060482288" tabIndex="0" />
                            </button>

                            <button className='alertSubButton' onClick={handleShareAlertClick}>{t('okay')}</button>
                        </div>

                        <button className={`blackCover ${showGuideAlert ? 'show' : ''}`} onClick={handleGuideAlertClick}></button>
                        <button className={`blackCover ${showScoreAlert ? 'show' : ''}`} onClick={handleScoreAlertClick}></button>
                        <button className={`blackCover ${showShareAlert ? 'show' : ''}`} onClick={handleShareAlertClick}></button>

                    </div>

                </div>
            </div>
        </>
    );
}
