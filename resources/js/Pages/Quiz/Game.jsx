import '../../../css/style.css'
import React, { Component } from "react";
import { Link, Head } from '@inertiajs/react';
import music from './Music';
import Addvertisement from './Addvertisement';
import { Inertia } from '@inertiajs/inertia';

export default class Game extends Component {

  constructor(props) {
    super(props);
    this.i = 0;
    this.id = null;
    this.questionNr = 1;
    this.questionCount = this.props.questions.data.length;
    this.score = 0;
    this.buttonsActive = true;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.noAnswerCount = 0;
    this.advertisement = props.advertisement;

    this.state = {
      correctCartVisible: false,
      wrongCartVisible: false,
      timeisup_visible: false,
      question_visible: true,
      selectedAnswer: null,
      questions: this.props.questions.data,
      answers: this.props.answers.data,
      correctAnswers: this.props.correct.data,
    };
  }
  componentDidMount() {
    this.move();
    music.playMusic();
  }

  move() {
    if (this.i === 0) {
      this.i = 1;
      let elem = document.getElementById("myBar");
      let startTime = Date.now();
      let oldCountDown = 11;
      let id = setInterval(frame.bind(this), 10);
      this.id = id;
      function frame() {
        let elapsedTime = Date.now() - startTime;
        let remainingTime = 11000 - elapsedTime;
        let progress = elapsedTime / 10100; // 10 seconds
        if (progress > 1) {
          this.buttonsActive = false;
          clearInterval(id);
          elem.style.width = "100%";
          let correctAnswer = this.state.correctAnswers.find((a) => a.question_id === this.questionNr)['correct_answer_id'];
          document.getElementById(correctAnswer).style.backgroundColor = "rgba(0, 255, 0, 0.5)";

          music.stopMusic();
          music.playTimeUp();
          this.setState({ timeisup_visible: true })
          setTimeout(() => {
            this.questionNr++;
            this.noAnswerCount++;
            if (this.questionNr === this.questionCount + 1) {
              this.goResult();
            }
            else {
              this.i = 0;
              this.setState({ timeisup_visible: false });
              document.getElementById(correctAnswer).style.backgroundColor = "#212373";
              this.setState({ selectedAnswer: null });
              this.move();
              music.playMusic();
              this.buttonsActive = true;
            }
          }, 3000);
        } else {
          elem.style.width = progress * 100 + "%";
          let countDown = Math.floor(remainingTime / 1000);
          let timerElem = document.getElementById("timer");
          if (countDown < oldCountDown) {
            timerElem.textContent = countDown;
            oldCountDown = countDown;
          }
        }
      }
    }
  }

  answered(answer) {
    let time = document.getElementById("timer").innerText;
    let correctAnswer = this.state.correctAnswers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id)['correct_answer_id'];

    this.buttonsActive = false;
    music.stopMusic();
    clearInterval(this.id);
    let answerStyle = document.getElementById(answer).style;
    let correctAnswerStyle = document.getElementById(correctAnswer).style;

    if (answer === correctAnswer) {
      this.correctCount++;
      music.playCorrect();
      this.setState({ correctCartVisible: true });
      answerStyle.backgroundColor = "rgba(0, 255, 0, 0.5)";

      if (time >= 5) { this.score = this.score + 12; this.attempt( this.props.questions.data[this.questionNr-1].question_id, 12); }
      else { this.score = this.score + 10; this.attempt( this.props.questions.data[this.questionNr-1].question_id , 10); }
    }
    else {
      this.wrongCount++;
      music.playWrong();
      this.setState({ wrongCartVisible: true });
      answerStyle.backgroundColor = "rgba(255, 0, 0, 0.5)";
      correctAnswerStyle.backgroundColor = "rgba(0, 255, 0, 0.5)";
      this.attempt( this.props.questions.data[this.questionNr-1].question_id, 0);
    }

    setTimeout(() => {
      this.questionNr++;
      if (this.questionNr === this.questionCount + 1) {
          this.goResult();
      }
      else {
        this.i = 0;
        answerStyle.backgroundColor = "#212373";
        correctAnswerStyle.backgroundColor = "#212373";
        this.setState({ wrongCartVisible: false });
        this.setState({ correctCartVisible: false });
        this.setState({ selectedAnswer: null });
        this.move();
        music.playMusic();
        this.buttonsActive = true;
      }
    }, 2500);
  }

  handleExitClick() {
    music.stopMusic();
    clearInterval(this.id);
    this.i = 0;
  }

  advertisementDiv = null;

  async attempt(question_id, point){
    await axios.post('/quiz/attempt',{
          question_id: question_id,
          point: point
    });
  }

  goResult(){
    let data = { score: this.score, correct: this.correctCount, wrong: this.wrongCount, noanswer: this.noAnswerCount };
    let queryString = new URLSearchParams(data).toString();
     window.location.href = "/result?" + queryString;
  }

  render() {
    /* Soru yoksa result sayfasina gonder */
    if(this.questionCount <= 0) {
      this.goResult();
    }

    if (this.advertisement.data[0].active && this.questionNr === this.advertisement.data[0].question_id) {
      this.advertisementDiv = <Addvertisement />;
    }else {
      this.advertisementDiv = null;
    }


    function mute() {
      const muteIcon = document.querySelector('#muteIcon');
      const unmuteIcon = document.querySelector('#unmuteIcon');
      if (unmuteIcon.style.display !== 'none') {
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
        music.stopMusic();
        music.closeSound();
      } else {
        unmuteIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        music.openSound();
        music.playMusic();
      }
    }

   /*  console.log(this.props.questions.data.find(q => q.question_id === 10).image); */
   /*  <img src={this.props.questions.data.find(q => q.question_id === 10).image} alt='img' /> */

    return (
      <>

        <Head title="Quiz" />

        {/* ADVERTISEMENT */}
        {this.advertisementDiv}

        <div className="bg">

          {/* SOUND ON OFF BUTTON */}
          <div onClick={mute} className=' absolute right-1 top-1 hover:scale-105 cursor-pointer'>
            <svg id='unmuteIcon' fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve"
              className='w-8 h-8 lg:w-12 lg:h-12 '>
              <path fillRule="evenodd" clipRule="evenodd" d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256
                      S397.391,0,256,0z M256,472c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"/>
              <path d="M331.141,148.297L232.156,208H168c-4.422,0-8,3.578-8,8v80c0,4.422,3.578,8,8,8h67.5l95.641,59.719
                      c17.031,9.969,20.859,1.938,20.859-17.844V166.109C352,146.359,348.172,138.312,331.141,148.297z"/>
            </svg>

            <svg id='muteIcon' fill="#C00000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve"
              className='w-8 h-8 lg:w-12 lg:h-12  hidden'>
              <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472
                      c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"/>
              <path d="M380.766,365.172L146.844,131.234c-4.312-4.312-11.297-4.312-15.609,0s-4.312,11.266,0,15.594l233.938,233.938
                      c4.312,4.312,11.297,4.312,15.594,0C385.078,376.469,385.078,369.484,380.766,365.172z"/>
              <path d="M352,325.094V166.109c0-19.75-3.828-27.797-20.859-17.812l-97.266,58.672L352,325.094z" />
              <path d="M181.094,208H168c-4.422,0-8,3.578-8,8v80c0,4.422,3.578,8,8,8h67.5l95.641,59.719c3.891,2.281,7.031,3.5,9.656,3.984
                          L181.094,208z"/>
              <path d="M380.766,365.172L146.844,131.234c-4.312-4.312-11.297-4.312-15.609,0s-4.312,11.266,0,15.594l233.938,233.938
                      c4.312,4.312,11.297,4.312,15.594,0C385.078,376.469,385.078,369.484,380.766,365.172z"/>
            </svg>
          </div>

          {/* TOP BAR : QUESTION NR - RESPONSE IMAGES - EXIT */}
          <div className='rowTop'>
            <div className='questionNr'> {this.questionNr} / {this.questionCount} </div>
            <div id='timeisup' className='answeredCart' style={{ display: this.state.timeisup_visible ? 'block' : 'none' }}>
              <img src="/img/timer.webp" alt="Logo" />
            </div>
            <div id='correct' className='answeredCart' style={{ display: this.state.correctCartVisible ? 'block' : 'none' }}>
              <img src="/img/correct.png" alt="Correct" />
            </div>
            <div id='wrong' className='answeredCart' style={{ display: this.state.wrongCartVisible ? 'block' : 'none' }}>
              <img src="/img/wrong.png" alt="Wrong" />
            </div>
            <Link href={'/'} style={{ textDecoration: 'none' }}>
              <button id='exitButon' className='exitButton' onClick={() => { this.handleExitClick(); }}>
                X
              </button>
            </Link>
          </div>
 
          {/* QUESTION */}
          <div id='question_div' style={{ display: this.state.question_visible ? 'block' : 'none' }}>
            <div className='timer'>
              <p id="timer">10</p>
              <div id='myProgress' className="myProgress">
                <div id='myBar' className="myBar"></div>
              </div>
              <svg fill='#E6BE43' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g data-name="Layer 3"><path d="M19.09 19.07h5.48a1 1 0 1 0 0-2H19.09a1 1 0 0 0 0 2zM14.79 25.88h9.26a1 1 0 0 0 0-2H14.79a1 1 0 0 0 0 2zM10.58 32.69H24.3a1 1 0 1 0 0-2H10.58a1 1 0 1 0 0 2zM25.57 38.49a1 1 0 0 0-1-1H5.76a1 1 0 0 0 0 2H24.57A1 1 0 0 0 25.57 38.49zM24.59 45.3a1 1 0 0 0-1-1H11a1 1 0 0 0 0 2H23.59A1 1 0 0 0 24.59 45.3zM24.57 51.11H19.09a1 1 0 0 0 0 2h5.48a1 1 0 1 0 0-2zM32.7 38.52a3.6 3.6 0 0 0 2.13-.7l.1-.09 10.26-9.92a1 1 0 0 0-1.09-1.64l-12.31 5.3-1 .43a.82.82 0 0 0-.2.12 3.6 3.6 0 0 0 2.14 6.5z"></path><path d="M54.54,16.08a1,1,0,0,0,.71.3,1,1,0,0,0,.71-.3l3-3a1,1,0,0,0,.3-.7,1,1,0,0,0-.3-.71L55.77,8.47a1,1,0,0,0-1.41,0l-3,3a1,1,0,0,0,0,1.41l1,.95-2.11,2.1A25.88,25.88,0,0,0,36.25,9.42v-1h2.66a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H27.22a1,1,0,0,0-1,1V7.47a1,1,0,0,0,1,1h2.66v.87a23.53,23.53,0,0,0-3.67.68A1,1,0,0,0,26.72,12a22.72,22.72,0,0,1,4.12-.69h0l.2,0,.66,0h0v1.18a1,1,0,0,0,2,0V11.2a23.71,23.71,0,0,1,10,2.68h0l-.6,1a1,1,0,0,0,1.73,1l.6-1a23.72,23.72,0,0,1,7.37,7.34h0l-1.09.63a1,1,0,0,0,1,1.73l1.11-.64A23.5,23.5,0,0,1,56.63,34H55.3a1,1,0,0,0,0,2h1.34A23.82,23.82,0,0,1,54,46.14l-1.19-.69a1,1,0,1,0-1,1.73l1.19.68h0a24,24,0,0,1-7.4,7.41h0l-.7-1.21a1,1,0,0,0-1.73,1l.7,1.21A23.74,23.74,0,0,1,33.67,59h0v-1.4a1,1,0,0,0-2,0V59a23.29,23.29,0,0,1-4.95-.74,1,1,0,0,0-1.22.71,1,1,0,0,0,.71,1.23,25.9,25.9,0,0,0,25.4-42.82l2.1-2.1Z"></path></g></svg>
            </div>

            <div className='question flex flex-col'>
              {this.props.questions.data[this.questionNr-1].image ? 
                ( <div className='mt-2 w-full flex justify-center items-center '>
                    <img src={this.props.questions.data[this.questionNr-1].image} alt="Question" className='max-h-52 object-cover' />
                  </div> ) : null}
              {this.state.questions.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id)?.text}
            </div>

            <div>
              <div className='answer_row'>
                <button id='1' className={`flex flex-col answer ${this.state.selectedAnswer === 1 && 'selected'} ${!this.buttonsActive && 'no-hover'}`} onClick={() => { this.setState({ selectedAnswer: 1 }); this.answered(1); }} disabled={!this.buttonsActive}>
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 1)?.image ? 
                  ( <div className='mt-2 w-full flex justify-center items-center '>
                      <img src={this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 1)?.image} alt="Answer1" className='max-h-56  object-cover'/>
                  </div>) : null }    
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 1)?.text}
                </button>
                <button id='2' className={`flex flex-col answer ${this.state.selectedAnswer === 2 && 'selected'} ${!this.buttonsActive && 'no-hover'}`} onClick={() => { this.setState({ selectedAnswer: 2 }); this.answered(2); }} disabled={!this.buttonsActive}>
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 2)?.image ? 
                  ( <div className='mt-2 w-full flex justify-center items-center '>
                      <img src={this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 2)?.image} alt="Answer2" className='max-h-56  object-cover'/>
                  </div>) : null }        
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 2)?.text}
                </button>
              </div>
              <div className='answer_row'>
                <button id='3' className={`flex flex-col answer ${this.state.selectedAnswer === 3 && 'selected'} ${!this.buttonsActive && 'no-hover'}`} onClick={() => { this.setState({ selectedAnswer: 3 }); this.answered(3); }} disabled={!this.buttonsActive}>
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 3)?.image ? 
                  ( <div className='mt-2 w-full flex justify-center items-center '>
                      <img src={this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 3)?.image} alt="Answer3" className='max-h-56  object-cover'/>
                  </div>) : null }             
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 3)?.text}
                </button>
                <button id='4' className={`flex flex-col answer ${this.state.selectedAnswer === 4 && 'selected'} ${!this.buttonsActive && 'no-hover'}`} onClick={() => { this.setState({ selectedAnswer: 4 }); this.answered(4); }} disabled={!this.buttonsActive}>
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 4)?.image ? 
                  ( <div className='mt-2 w-full flex justify-center items-center '>
                      <img src={this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 4)?.image} alt="Answer4" className='max-h-56  object-cover'/>
                  </div>) : null }
                  {this.state.answers.find((a) => a.question_id === this.props.questions.data[this.questionNr-1].question_id && a.option === 4)?.text}
                </button>
              </div>
            </div>
          </div>
        </div>  
      </>

    )
  }
}

