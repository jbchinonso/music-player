let file, song, reader

let playlist = document.getElementById('playlist');
const addSong = document.getElementById('getAudio')
const stop = document.getElementById('stop')
const play = document.getElementById('play')
const pause = document.getElementById('pause')
const next = document.getElementById('next')
const  previous = document.getElementById('previous')




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
    playBackground()

    
}



function selectSong(){
    const tracks = document.querySelectorAll('.track')
    tracks.forEach((track)=>{
        track.addEventListener('click',function(){
            song.pause()
            song.currentTimeStamp = 0
            song = new Audio(track.getAttribute('song'))
            song.play()
           // track.previousSibling.classList.remove('active')
            document.querySelector('.active').classList.remove('active')
            track.classList.add('active')
           

        })
    })
}




stop.addEventListener('click', (e) =>{
    song.pause()
    song.currentTime = 0
    play.style.display = 'inline'
    pause.style.display = 'none'
})

play.addEventListener('click',(e)=>{
    song.play()
    play.style.display = 'none'
    pause.style.display = 'inline'

})

pause.addEventListener('click',(e)=>{
    song.pause()
    play.style.display = 'inline'
    pause.style.display = 'none'
})

next.addEventListener('click',(e)=>{
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
        
    }
})

previous.addEventListener('click',(e)=>{
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
        
    }
})

function playBackground(){
    const levels = document.querySelector('.display video')
    levels.play()
    
    

}