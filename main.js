let file, song, reader

let playlist = document.getElementById('playlist');
const addSong = document.getElementById('getAudio')


const levels = document.querySelector('.display video')

// add songs to playlist when file button is clicked

addSong.addEventListener('change', function(e){
    file = e.currentTarget.files[0]
    
    if(file){
        reader = new FileReader()
        reader.onload = function(e){
            let audioFile = e.target.result;
            const item = document.createElement('li')
            item.setAttribute('song',`${audioFile}`)
            item.setAttribute('file',`${file}`)
            item.setAttribute('class','track')
            item.append(file.name.split('.mp3')[0])
            playlist.appendChild(item)
            if(playlist.childElementCount === 1){
                initialiazer(file,audioFile)
               
            }

            if(playlist.childElementCount > 1){
               selectSong();
            }
            addSong.value = '';
            
        }   
        
        reader.readAsDataURL(file)
        
    }  
   

})


function initialiazer(file, audioFile){
    reader = new FileReader()
    song = new Audio(audioFile)
    song.play()
    play.style.display = 'none'
    pause.style.display = 'inline'
    playlist.firstChild.classList.add('active')
    //play background video while song plays
    levels.play()
    //show the song duration
    showDuration()
    if(song.end) nextbtn()
}


//make the songs in the playlist playable
function selectSong(){
    const tracks = document.querySelectorAll('.track')
    tracks.forEach((track)=>{
        track.addEventListener('click',function(){
            song.pause()
            song.currentTime = 0
            song = new Audio(track.getAttribute('song'))
            song.play()
           // track.previousSibling.classList.remove('active')
            document.querySelector('.active').classList.remove('active')
            track.classList.add('active')
            

        })
    })
}


//show the duration of the song while if plays
function showDuration(){
   // let duration = song.duration
   song.addEventListener('timeupdate',function(){
        let value
        let h = Math.floor(song.currentTime / 3600)
        let m = parseInt(song.currentTime / 60)
        let s = parseInt(song.currentTime % 60 )
        if (m < 10) m = '0' + m
        if (s < 10) s = '0' + s
        if (h < 10) h = '0' + h
        document.querySelector('.duration').textContent = h + ':'+ m +':' + s
        if(song.currentTime > 0){
            value = (100/song.duration)*song.currentTime
            document.querySelector('.progress').style.width = value + '%'
            document.querySelector('.progress').style.height = '8px'
        }
       
    })
}

//Go to the next song when the current song ends
song.onended = function(){
    nextbtn()
}

// stop button
function stopbtn(){
    song.pause()
    levels.pause()
    song.currentTime = 0
    play.style.display = 'inline'
    pause.style.display = 'none'
    
}

//play button
function playbtn(){
    song.play()
    levels.play()
    play.style.display = 'none'
    pause.style.display = 'inline'
}

// pause button
function pausebtn(){
    song.pause()
    levels.pause()
    play.style.display = 'inline'
    pause.style.display = 'none'
}


// next button
function nextbtn(){

    if(playlist.childElementCount > 1){
        const crntSong = document.querySelector('.active')
        let nextSong
        if(crntSong.nextElementSibling){
             nextSong = crntSong.nextSibling
        } else{
             nextSong = playlist.firstChild
        }
        
        song.pause()
        song.currentTime = 0
        song = new Audio(nextSong.getAttribute('song'))
        crntSong.classList.remove('active')
        nextSong.classList.add('active')
        song.play()
        showDuration()
        
    }
}

//previous button

function previousbtn(){
    if(playlist.childElementCount > 1){
        const crntSong = document.querySelector('.active')
        let prevSong
        if(crntSong.previousElementSibling){
            prevSong = crntSong.previousSibling
        } else{
            prevSong = playlist.lastChild
        }
        
        song.pause()
        song.currentTime = 0
        song = new Audio(prevSong.getAttribute('song'))
        crntSong.classList.remove('active')
        prevSong.classList.add('active')
        song.play()
        showDuration()
        
    }
}

// volume Adjustment function
function volume(){
   const volumebtn = document.getElementById('volume')
   let maxvol = volumebtn.getAttribute('max')
   song.volume = parseFloat(volumebtn.value/maxvol)
}


