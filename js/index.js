const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// query element
const cdThumbRotate = $(".cd-thumb ");

const cdThumb = $("#process-thumb");
const cdName = $("#cd-name");
const cdSinger = $("#cd-singer");
const audio = $("#audio");

const playBtn = $("#btn-play");
const prevBtn = $("#btn-prev");
const nextBtn = $("#btn-next");
const progress = $("#progress");
const randomBtn = $("#btn-random");
const repeatBtn = $(".repeat");
const startBtn = $("#started");
const startIconBtn = $("#started-icon");
const playlist = $(".list-song_select");
const volume = $("#volume");
const musicCurrentTime = $('.current');
const musicDuration = $('.duration');
const slidebarVolume = $('#progress-volume');
//Varriables
let cdThumbAnimate ;
let cdThumbAnimate2 ;


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom:false,
  isRepeat: false,
  isMuted: false,
  isRotate: false,
  songs: [
    {
      name: "Another Day",
      singer: "Monday Kiz, Punch",
      path: "./image/anotherday.mp3",
      image: "./image/anotherday.jpg",
      time: "03:38"
    },
    {
      name: "Can You Hear Me",
      singer: "Ben",
      path: "./image/canyouhearme.mp3",
      image: "./image/canyouhearme.jpg",
      time: "04:32"
    },
    {
      name: "Can You See My Heart",
      singer: "Heize",
      path: "./image/canyouseemyheart.mp3",
      image: "./image/canyouseemyheart.jpg",
      time: "03:46"
    },
    {
      name: "Done For Me",
      singer: "Punch",
      path: "./image/doneforme.mp3",
      image: "./image/doneforme.jpg",
      time: "03:52"
    },
    {
      name: "Lean On Me",
      singer: "10cm",
      path: "./image/leanonme.mp3",
      image: "./image/leanonme.jpg",
      time: "03:31"
    },
    {
      name: "Only You",
      singer: "Yang Da ll",
      path: "./image/onlyyou.mp3",
      image: "./image/onlyyou.jpg",
      time: "04:14"
    },
    {
      name: "Say Good Bye",
      singer: "Son Haye",
      path: "./image/saygoodbye.mp3",
      image: "./image/saygoodbye.jpg",
      time: "03:06"
    },
    {
      name: "So Long",
      singer: "Paul Kim",
      path: "./image/solong.mp3",
      image: "./image/solong.jpg",
      time: "03:45"
    },
  ],
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
                <div class="item ${index == this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <i class="fas fa-music"></i>
                    <img src="${song.image}" alt="" class="thumbnail">
                    <div class="des">
                        <h5>${song.name}</h5>
                        <p>${song.singer}</p>
                    </div>  
                    <p class="duration">${song.time}</p>
                    <div class="action">
                        <a href="#"><i class="fas fa-microphone"></i></a>
                        <a href="#"><i class="fas fa-heart"></i></i></a>
                        <a href="#"><i class="fas fa-info"></i></a>
                    </div>
                </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    app.rotateCD();
    // Xử lý button play/pause song
    playBtn.addEventListener("click", function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      // Khi Play Song
      audio.onplay = function (e) {
        // Xử lý update current Time 
        setInterval(() => {
          isRotate = true;
          let gettingcurrentTime = audio.currentTime;
          //update current time to UI
          let currentMin = Math.floor(gettingcurrentTime / 60);
          console.log(currentMin)
          let currentSec = Math.floor(gettingcurrentTime % 60);
          console.log(currentSec)
          if(currentSec < 10){
            currentSec = `0${currentSec}`;
          }
          musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
        }, 1000);
        //check isplaying
        app.isPlaying = true;
        // Add romove icon Play/pause
        playBtn.classList.remove("fa-play-circle");
        playBtn.classList.add("fa-pause-circle");
        // Quay cd
        cdThumbAnimate.play();
        cdThumbAnimate2.play();
      };
      // Khi Pause Song
      audio.onpause = function () {
        app.isPlaying = false;
        playBtn.classList.remove("fa-pause-circle");
        playBtn.classList.add("fa-play-circle");
        cdThumbAnimate.pause();
        cdThumbAnimate2.pause();
      };
      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };
      //Xử lý khi tua
      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };
    });
    // Xử lý khi prev song
    prevBtn.addEventListener("click", function () {
      if(app.isRandom){
        app.randomSong();
      }else{
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    });

    // Xử lý khi next song
    nextBtn.addEventListener("click", function () {
      if(app.isRandom){
        app.randomSong();
      }else{
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    });

    //Random Song
    randomBtn.addEventListener("click", function(){
    app.isRandom = !app.isRandom;
    randomBtn.classList.toggle('active',app.isRandom);  
    })

    // Xử lý khi kết thúc bài hát
    audio.onended = function(){
      if(app.isRepeat){
        audio.play();
      }else{
        nextBtn.click();
      }
    }

    //Xử lý khi chọn bài hát
    playlist.addEventListener("click", (e) => {
      const songNode = e.target.closest('.item:not(.active)'); 
      if(songNode){
        app.currentIndex = songNode.dataset.index;
        console.log(this.currentIndex);        
        app.loadCurrentSong();
        //check isplaying
        app.isPlaying = true;
        // Add romove icon Play/pause
        playBtn.classList.remove("fa-play-circle");
        playBtn.classList.add("fa-pause-circle");
        // Quay cd
        if(app.isRotate==false){
          isRotate = true;
          app.rotateCD();
          cdThumbAnimate.play();
          cdThumbAnimate2.play();
        }
        audio.play();
        app.render();
      }
    });

    // Lặp lại bài hát
    repeatBtn.addEventListener("click", () => {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle('active',app.isRepeat); 
    });
    //random
    startBtn.addEventListener("click", () => {
      startIconBtn.classList.remove("fa-play");
      startIconBtn.classList.add("fa-pause");

      playBtn.classList.remove("fa-play");
      playBtn.classList.add("fa-pause");
      startBtn.textContent  ;
      app.randomSong();
      audio.play();
    });
    //Bật / tắt âm lượng
    volume.addEventListener("click", () => {
      if(this.isMuted){
        volume.classList.remove('fa-volume-mute');
        volume.classList.add('fa-volume-up');
        this.isMuted = false;
        audio.muted = false;
      }else{
        volume.classList.remove('fa-volume-up');
        volume.classList.add('fa-volume-mute');
        this.isMuted = true;
        audio.muted = true;
      }
      
    });
    // SlideBar Volume
    slidebarVolume.addEventListener("change", function(e) {
      audio.volume = e.currentTarget.value / 100;
      })
  },
  scrollToActiveSong: function(){
    setTimeout(() => {  
      $('.item.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest' 
      })
    }, 300);
  },
  loadCurrentSong: function () {
    
    cdThumb.src = this.currentSong.image;
    cdName.textContent = this.currentSong.name;
    cdSinger.textContent = this.currentSong.singer;
    audio.src = this.currentSong.path;

    //update duration song to UI
    musicDuration.innerText = this.currentSong.time;
  },
  rotateCD: function() {
    //Xử lý CD quay / dừng
    cdThumbAnimate = cdThumbRotate.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cdThumbAnimate2 = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cdThumbAnimate.pause();
    cdThumbAnimate2.pause();


  },
  nextSong: function () {
    app.isPlaying = true;
    playBtn.classList.remove("fa-play-circle");
    playBtn.classList.add("fa-pause-circle");
    this.currentIndex++;
    console.log(this.currentIndex);
    if (this.currentIndex >= this.songs.length) {
      console.log(this.currentIndex);
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    // Quay cd
    cdThumbAnimate.play();
    cdThumbAnimate2.play();
  },
  prevSong: function () {
    app.isPlaying = true;
    playBtn.classList.remove("fa-play-circle");
    playBtn.classList.add("fa-pause-circle");
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
      // Quay cd
      cdThumbAnimate.play();
      cdThumbAnimate2.play();
  },
  randomSong: function(){
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    }while(newIndex===this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện
    this.handleEvent();

    //Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    //Render Playlist
    this.render();
  },
};

app.start();
