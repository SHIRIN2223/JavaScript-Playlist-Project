/* elementlere ulasma - obje olusturma*/
const prevButton =document.getElementById('prev')
const playButton =document.getElementById('play')
const pauseButton =document.getElementById('pause')
const nextButton =document.getElementById('next')
const repeatButton =document.getElementById('repeat')
const shuffleButton =document.getElementById('shuffle')
const audio =document.getElementById('audio')
const songImage =document.getElementById('song-image')
const songName =document.getElementById('song-name')
const songArtist =document.getElementById('song-artist')
const playListButton =document.getElementById('playlist')

const maxDuration =document.getElementById('max-duration')
const currentTimeRef =document.getElementById('current-time')

const progressBar =document.getElementById('progress-bar')
const playlistContainer =document.getElementById('playlist-container')
const closeButton =document.getElementById('close-button')
const playlistSong =document.getElementById('playlist-songs')

const currentProgress =document.getElementById('current-progress')


//indis
let index

//tekrari
let loop

//decode veya parse
const songsList = [
    {
        name: "Gelo Ew Ki Bu",
        link: "assets/assets_gelo-ew-ki-bu.mp3",
        artist: "Aram Tigran",
        image: "assets/aram-tigran .jpeg"
    },
    {
        name: "Gitme Kal",
        link: "assets/assets_yara-bere-icindeyim.mp3",
        artist: "Hira-i Zerdust",
        image: "assets/hirai.jpeg"
    },
    {
        name: "Aramam",
        link: "assets/assets_aramam.mp3",
        artist: "Ibrahim Tatlises",
        image: "assets/ibrahim-tatlises.jpeg"
    },
    {
        name: "Ax Eman",
        link: "assets/assets_ax-eman.mp3",
        artist: "Rewsan Celiker",
        image: "assets/rewsan-celiker.jpeg"
    },
    {
        name: "Dinle",
        link: "assets/assets_dinle.mp3",
        artist: "Mahsun Kirmizigul",
        image: "assets/mahsun.jpeg"
    }
]


//olaylar objesi
let events = {
    mouse:{
        click:"click"
    },
    touch:{
        click:"touchstart"
    }
}

let deviceType =""

const isTouchDevice = () => {
    try{
        document.createEvent('TouchEvent')
        deviceType ="touch"
        return true
    }catch (error) {
        deviceType ="mouse"
        return false

    }
}

//zaman formatlama

const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second :second
    return `${minute}:${second}`

}

//set song

const setSong = (arrayIndex) => {
    //tum ozellikler
    console.log(arrayIndex)
    let { name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML =artist
    songImage.src =image

    //süreyi göster
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)//320
    }
    playlistContainer.classList.add("hide")
    playAudio()

    
}
//sarkiyi oynat

const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}

//sarkiyi takrar 
repeatButton.addEventListener('click', ()=>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log("tekrar kapatıldı")
    } else {
        repeatButton.classList.add('active')
        audio.loop = true 
        console.log("tekrar acık")

    }
})

//sonraki şarkıya git
const nextSong = () => {
    //eger dongu acik caliyorsa
    if (loop) {
        if (index == (songsList.length - 1)) {
            //sondayda basa sar
            index = 0
        } else {
            index += 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        console.log(randIndex)
        setSong(randIndex)
    }
    playAudio()
}

//sarkiyi durdur

const pauseAudio = () =>{
audio.pause()
pauseButton.classList.add('hide')
playButton.classList.remove('hide')
}

//onceki şarkıya gecmek istiyorsa
const previousSong= ()=>{
    if(index>0){
        pauseAudio()
        index-=1

    }else{
        index=songsList.length - 1

    }
    setSong(index)
    playAudio()
}

//sıradakine gec
audio.onended = () =>{
    nextSong()
}

//karıştırmak için

shuffleButton.addEventListener('click', ()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop =true
        console.log("karıştırma kapalı")
    }shuffleButton.classList.add('active')
    loop=false
    console.log("karıştırma acık")
})

//play buttona tıklanınca
playButton.addEventListener('click',playAudio)

//next butonuna tıklanınca
nextButton.addEventListener('click', nextSong)

//pause butonuna tıklanınca
pauseButton.addEventListener('click', pauseAudio)

//prev butonun a tıklanınca
prevButton.addEventListener('click', previousSong)


isTouchDevice()
progressBar.addEventListener(events[deviceType].click, (event) => {
    //progress bari baslat
    let coordStart = progressBar.getBoundingClientRect().left

    //fare ile dokunma
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    //genisligi ata
    currentProgress.style.width = progress * 100 + "%"

    //zamani ata
    audio.currentTime = progress * audio.duration

    //oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

//zaman aktıkc güncellle
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);


//zaman güncellemesi
audio.addEventListener('timeupdate', () =>  {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

window.onload = () => {
    index = 0;
    setSong(index);
    initPlayList(); 
};

const initPlayList = () => {
    for (let i in songsList) {
        playlistSong.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-album">
            ${songsList[i].artist}
            </span>
        </div>
        </li>
        `;
    }
}

//sarkı listesini 
playListButton.addEventListener('click', ()=>{
    playlistContainer.classList.remove('hide')
})

//sarki listesini kapat
closeButton.addEventListener('click', ()=>{
    playlistContainer.classList.add('hide')
})



















































































































































































