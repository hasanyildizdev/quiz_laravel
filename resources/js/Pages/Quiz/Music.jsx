const audio = new Audio('http://localhost:8000/media/music.mp3');
const correct = new Audio('http://localhost:8000/media/true.mp3');
const wrong = new Audio('http://localhost:8000/media/wrong.mp3'); 
const time_up = new Audio('http://localhost:8000/media/time_up.mp3'); 

let soundStatus = true;

 const music = {
  playMusic: () => {
    if(soundStatus){
      audio.play();
    }
  },
  stopMusic: () => {
    if(soundStatus){
      audio.pause();
      audio.currentTime = 0;
    }
  },
  playCorrect: () => {
    if(soundStatus){
      correct.play();
    }
  },
  playWrong: () => {
    if(soundStatus){
      wrong.play();
    }
  },
  playTimeUp: () => {
    if(soundStatus){
      time_up.play();
    }
  },
  closeSound:() => {
    soundStatus = false;
  },
  openSound: () => {
    soundStatus = true;
  }
};

export default music;