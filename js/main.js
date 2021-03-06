
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
                songtags()
            }

            if(playlist.childElementCount > 1){
                selectSong();
                findtags(file)
               
            }
            
            addSong.value = '';
            
        }   
        
        reader.readAsDataURL(file)
        
    }  
   
    
})


function initialiazer(file, audioFile){
    playlist.firstChild.classList.add('active')
    play.style.display = 'none'
    pause.style.display = 'inline'
    song = new Audio(audioFile)
    song.volume = 0.5
    song.play()
    //play background video while song plays
    levels.play()
    //show the song duration
    showDuration()
    
}


//make the songs in the playlist playable
function selectSong(){
    //select all the songs in the playlist
    const tracks = document.querySelectorAll('.track')
    //set song Attribute to each of the tracks in the playlist
    tracks.forEach((track)=>{
        track.addEventListener('click',function(){
            song.pause()
            song.currentTime = 0
            song = new Audio(track.getAttribute('song'))
            song.volume = 0.5
            song.play();
            //set the track tags
            document.querySelector('.song-title').textContent = track.dataset.title
           // track.previousSibling.classList.remove('active')
            document.querySelector('.active').classList.remove('active')
            track.classList.add('active')
            showDuration()
            setTags(track)
            
        })
    })
}


//show the duration of the song while if plays
function showDuration(){
    //start a timer once the song starts
   song.addEventListener('timeupdate',function(){
        let value
        // get hour,minute and seconds of the song
        let h = Math.floor(song.currentTime / 3600)
        let m = parseInt(song.currentTime / 60)
        let s = parseInt(song.currentTime % 60 )
        //attach zero to the value when it is less than 10
        if (m < 10) m = '0' + m
        if (s < 10) s = '0' + s
        if (h < 10) h = '0' + h
        document.querySelector('.duration').textContent = h + ':'+ m +':' + s
        //start showing the progress once the song starts
        if(song.currentTime > 0){
            //calculate the percentage of the song played
            value = (100/song.duration)*song.currentTime
            // set the progress to the percentage of song played
            document.querySelector('.progress').style.width = value + '%'
            document.querySelector('.progress').style.height = '8px'
            //Go to the next song when the current song ends
            const nowplaying = document.querySelector('.active')
            if(song.ended && nowplaying.nextElementSibling) nextbtn()
        }
       
    })
}

// stop button
function stopbtn(){
    song.pause()
    levels.pause()
    song.currentTime = 0
    play.style.display = 'inline'
    pause.style.display = 'none'
    document.querySelector('.progress').style.width = 0
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
        song.volume = 0.5
        crntSong.classList.remove('active')
        nextSong.classList.add('active')
        song.play()
        showDuration()
        songtags()
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
        song.volume = 0.5
        crntSong.classList.remove('active')
        prevSong.classList.add('active')
        song.play()
        showDuration()
        songtags()
    }
}

// volume Adjustment function
function volume(){
   const volumebtn = document.getElementById('volume')
   let maxvol = volumebtn.getAttribute('max')
   song.volume = parseFloat(volumebtn.value/maxvol)
}

//show the playlist when mobile menu button is clicked
const menubtn = document.querySelector('.mobile-menu')
menubtn.addEventListener('click',()=>{
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('visible')
})

//fetch the ID3 tags of the song with jsmediatags library
//const jsmediatags = require("jsmediatags")
function findtags(musicfile){
    const tracks = document.querySelectorAll('.track')
    const jsmediatags = window.jsmediatags

    jsmediatags.read(musicfile, {
        onSuccess: function(tags){
            tracks.forEach(track => {
                let picture = tags.tags.picture
            if(picture){
                let base64String = ''
                for(let i = 0; i < picture.data.length; i++){
                    base64String += String.fromCharCode(picture.data[i])
                }
                const imgSrc = 'data:'+ picture.format + ';base64,' + window.btoa(base64String);
                track.dataset.picture = imgSrc
            }
           
                track.dataset.title = tags.tags.title
                track.dataset.artist = tags.tags.artist
                track.dataset.album = tags.tags.album
            
            })
           
            
        },
        onError: function(error){
            console.log(error.type,error.info)
        
        }
    })
}

function setTags(track){
    document.querySelector('.pictureTag img').src = track.dataset.picture
    document.querySelector('.song-title').textContent = track.dataset.title + ' || ' 
            + track.dataset.artist + ' || ' + track.dataset.album
}

function songtags(){
    const myfile = document.querySelector('.active').getAttribute('song')
    fetch(myfile).then(resp => resp.blob())
   .then(data => 
    jsmediatags.read(data,{
        onSuccess: function(tags){
            let picture = tags.tags.picture
            if(picture){
                let base64String = ''
                for(let i = 0; i < picture.data.length; i++){
                    base64String += String.fromCharCode(picture.data[i])
                }
                const imgSrc = 'data:'+ picture.format + ';base64,' + window.btoa(base64String);
                document.querySelector('.pictureTag img').src = imgSrc
            }
            document.querySelector('.song-title').textContent = tags.tags.title + ' || ' 
            + tags.tags.artist + ' || ' + tags.tags.album
            //console.log(tags.tags)
        }

    })
   )
}
