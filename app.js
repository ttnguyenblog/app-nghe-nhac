/*

1.Render 

*/




const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playBtn = $('.btn-toggle-play');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevtBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
            name : 'Anh đã từ bỏ rồi đấy',
            singer : 'Nguyenn',
            path: './song/1.mp3',
            image : './img/anh-da-tu-bo-roi-day.jpg'
    
        },
    
        {
            name : 'Kẻ Theo Đuổi Ánh Sáng',
            singer : 'Huy Vạc',
            path: './song/Kẻ Theo Đuổi Ánh Sáng (Lofi Ver.) - Huy Vạc x Tiến Nguyễn x Freak D.mp3',
            image : './img/a.jpg'
    
        },
    
        {
            name : 'Lần sau cuối',
            singer : 'DuongG',
            path: './song/Lần Sau Cuối (Lofi Ver.) - DuongG x Freak D.mp3',
            image : './img/lan-sau-cuoi.jpg'
    
        },
    
        {
            name : 'Ngày Em Đẹp Nhất',
            singer : 'Tama',
            path: './song/Ngày Em Đẹp Nhất (Lofi Ver.) - Tama x Will M - Vì ngày em đẹp nhất là ngày anh mất em - Lyrics Video.mp3',
            image : './img/ngay-em-dep-nhat.jpg'
    
        },
    ],
    render: function(){
        const html = this.songs.map((song,index)=>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h" ></i>
                </div>
            </div>` 
        })
        playlist.innerHTML = html.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },

    handlEvents: function(){
        const cd = $('.cd');
        const cdwdith = cd.offsetWidth;
        const _this = this;

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],
            {
                duration:10000,
                interations: Infinity
            })

        cdThumbAnimate.pause();

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cdwdith - scrollTop;

            cd.style.width = newCdwidth >0 ? + newCdwidth + 'px' : 0;
            cd.style.opacity = newCdwidth /cdwdith;
        }

        
        playBtn.onclick = function () {
            if (_this.isPlaying) {
              audio.pause();
            } else {
              audio.play();
            }
          };
        
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
          };

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e){
            const seek = audio.duration /100* e.target.value;

            audio.currentTime = seek;
        }

        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevtBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            
            randomBtn.classList.toggle("active", _this.isRandom);
        } 

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        audio.onended = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else if (_this.isRepeat){
                audio.play();
            }else{
                _this.nextSong();
            }
            audio.play();
        }

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if( e.target.closest('.song:not(.active)')|| e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex =Number( songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
          
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },


    randomSong: function () {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.currentIndex)

        this.currentIndex= newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest',
            });
        },500)
    },

    loadCurrentSong: function(){
        
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src= this.currentSong.path;
        
    },

    
    start: function(){
        
        this.handlEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();

    }
}

app.start();