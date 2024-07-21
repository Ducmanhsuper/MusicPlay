// javascript
let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let SongThumb = $(".SongThumnail");
let ListSong = $(".ListSongLayout");
let songLayout = $(".SongLayout");
const range = $(".slider");
let SongName = $(".SongName");
let TimeSong = $(".TimeSong");
let AudioSong = $(".audioSong");
let PlayBtn = $(".playbtn");
let Pausebtn = $(".pausebtn");
let nextbtn = $(".nextbtn");
let prebtn = $(".prebtn");
app = {

    currentIndex: 0,
    // lấy dữ liệu bài hát phía backend 

    getSongData: async function () {
        const data = await (await fetch("https://ducmanhsuper.github.io/Datamusic/Data.json")).json();
        return data;
    },

    // dùng phương thức map để render ra danh sách bài hát
    renderSong: async function () {
        const Songs = await app.getSongData();
        ListSong.innerHTML = Songs.map((song, index) => {
            return `
             <div class="musicItem">
                <div class="SongNumber">${index + 1}</div>
                <div class="SongName">${song.Name}</div>
                <div class="SongPlayBtn">
                    <i class="fa-solid fa-play" style="color: #63E6BE; font-size: 20;"></i>
                </div>

            </div>
            ` }).join("");

    },
    //  lấy bài hát hiện tại 
    getCurrentSong: async function () {

        let Songs = await app.getSongData();
        return {
            NameSong: Songs[app.currentIndex].Name,
            LinkSong: Songs[app.currentIndex].Link
        }

    },
    // tải bài hát hiện tại vào view
    loadcurrentSong: async function () {
        const Songs = await app.getSongData();
        const Song = await app.getCurrentSong();
        SongName.innerHTML = Song.NameSong;
        AudioSong.src = Song.LinkSong;
        const SongPlay = () => {
            AudioSong.play();
            Pausebtn.style.display = "flex";
            PlayBtn.style.display = "none";
        }
        const songPause = () => {
            AudioSong.pause();
            Pausebtn.style.display = "none";
            PlayBtn.style.display = "flex";
        }
        const songNext = async function () {
            app.currentIndex = app.currentIndex + 1;
            if (app.currentIndex > Songs.length - 1) {
                app.currentIndex = 0;
            }
            await app.getCurrentSong();
            await app.loadcurrentSong();

        }
        const SongPrev = async function () {
            app.currentIndex = app.currentIndex - 1;
            if (app.currentIndex < 0) {
                app.currentIndex = Songs.length - 1;
            }
            await app.getCurrentSong();
            await app.loadcurrentSong();

        }

        AudioSong.played = function () {
            console.log("C");
        }
        // if (AudioSong.onplay)


        //  Action 
        PlayBtn.onclick = function () {
            SongPlay();
        }

        Pausebtn.onclick = function () {
            songPause();
        }

        nextbtn.onclick = function () {
            songNext();
        }
        prebtn.onclick = function () {
            SongPrev();
        }
        return AudioSong;


    },

    // lấy thời gian của bài hát
    getTimeSong: async () => {
        const AudioCurrentSong = await app.loadcurrentSong();
        AudioCurrentSong.onloadeddata = () => {

            let time = AudioCurrentSong.duration / 60;
            let timeSong = time.toFixed(1);
            TimeSong.innerHTML = timeSong + "p"
            TimeSong.style.color = "#F6FB7A";
            TimeSong.style.fontSize = 20 + "px";
        }

    },
    // tùy chỉnh thanh trượt 
    customRange: async function () {
        const AudioCurrentSong = await app.loadcurrentSong();
        AudioCurrentSong.ontimeupdate = function () {
            const currentTime = (AudioCurrentSong.currentTime / 60).toFixed(2);
            if (currentTime > 0) {
                SongThumb.style.transition = "400s";
                SongThumb.style.transform = "rotate(72000deg)";
            }
            const Fulltime = (AudioCurrentSong.duration / 60).toFixed(2);

            if (currentTime >= AudioCurrentSong.duration) {
                app.songNext();
                SongThumb.style.transform = "rotate(0deg)";
            }
            const currentVal = currentTime;
            const max = Fulltime;
            range.style.backgroundSize = currentVal / Fulltime * 100 + "% 100%";

        }





    },
    start: function () {
        app.renderSong();
        app.customRange();
        app.loadcurrentSong();
        app.getTimeSong();

    }



}

app.start();





