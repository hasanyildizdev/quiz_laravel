const audio = new Audio('http://localhost:8000/media/music.mp3');
const correct = new Audio('http://localhost:8000/media/true.mp3');
const wrong = new Audio('http://localhost:8000/media/wrong.mp3'); 
const time_up = new Audio('http://localhost:8000/media/time_up.mp3'); 

 const music = {
  playMusic: () => {
    audio.play();
  },
  stopMusic: () => {
    audio.pause();
    audio.currentTime = 0;
  },
  playCorrect: () => {
     correct.play();
  },
  playWrong: () => {
     wrong.play();
  },
  playTimeUp: () => {
   time_up.play();
  }
};

export default music;