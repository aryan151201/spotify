console.log("hello this is spotify playlist ");
let currentsong = new Audio();
let songs;
let currfolder;
function SecondsToMinutes(inputSeconds) {
  const seconds = Number(inputSeconds); // ensure it's a number
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // also ensure no floating points
  const formattedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${formattedSecs}`;
}
async function getsongs(folder) {
  currfolder=folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  ///console.log(response)
  let div = document.createElement("div"); /// creates temproray div element in memory (not adade in page ) used to parse html string as a part of document
  div.innerHTML = response; // insert the html into div , div acts like mini document caonating the fetched html
  let as = div.getElementsByTagName("a"); // finds all the anchor tags in the document
  ///console.log(as)/// as becomes html colllection f linkss of tags
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); ////// splitting the array into two half and selcting the seccond  part after the cut
    } /// as [0] is the 1 st part and [1] is the secconfd part after the cut
  }




    // show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML=""
  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li><img src="img/music.svg" class="invert" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Arjit</div>
              </div>
              <div class="playnow">
                <span>play now</span>
                <img src="img/play.svg" class="invert" alt="">
              </div></li>`;
  }
    //attach a event listenr to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
      e.addEventListener("click", (element) => {
        // console.log(e.getElementsByTagName("div")[0])
        //console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      });
    });

    return songs
}

const playMusic = (track, pause = false) => {
  // let audio= new Audio("/songs/"+track)
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00/00";

}
async function displayalbum(){
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div"); /// creates temproray div element in memory (not adade in page ) used to parse html string as a part of document
  div.innerHTML = response;
 let anchors= div.getElementsByTagName("a")
 let cardcontainer=document.querySelector(".cardcontainer")
 //console.log(anchors)
 let array=Array.from(anchors)

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
  if(e.href.includes("/songs/")){
    let folder=e.href.split("/").slice(-1)[0]
    // get the metadata of the folder
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
    let response = await a.json();
    //console.log(response)
    
    cardcontainer.innerHTML=cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card p1">
            <div  class="play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                <path d="M8 5v14l11-7z" fill="#000" stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.discription}</p>
          </div>`
  }
 }

  //add event listner to the card looad the playlist when card is clikcked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    // console.log(e)
     e.addEventListener("click",async item=>{
      console.log("fetching songs")
      // console.log(item.currentTarget.dataset)       
       //// if target was use it will select images or p tag 
       /// but current target is used whherever we click the card would be swelected because the click even is oon the card 
       songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
      })
    })

 
  
}

async function main() {
  //get  the list of all soongs
  await getsongs("songs/ncs");
  playMusic(songs[0], true);
  //console.log(songs);
 

    //display all the albums oont he page 
    displayalbum()



  // // play the first song
  // var audio = new Audio(songs[6]);
  // //audio.play();

  // audio.addEventListener("loadeddata", () => {
  //   let duration = audio.duration;
  //   console.log(duration);
  //   // The duration variable now holds the duration (in seconds) of the audio clip
  // });

  //attach event listner  to all the play previous and next button
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  // attach time for the music
  currentsong.addEventListener("timeupdate", () => {
    //console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${SecondsToMinutes(
      currentsong.currentTime
    )}/${SecondsToMinutes(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  //add event listber to the seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // add an event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  // add event listner ffor hamburger x
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-465px";
  });
  //add even listner to next and previous button
  previous.addEventListener("click", () => {
   // console.log("previous clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
   // console.log("next clicked");

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  })

 /// add an event ot volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
 // console.log(e,e.target,e.target.value)
  currentsong.volume=parseInt(e.target.value)/100
 })

 // add a event listner to mute
 document.querySelector(".volume>img").addEventListener("click",e=>{
  if(e.target.src.includes("img/volume.svg")){
    e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
    currentsong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0
  }
  else{
    e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
    currentsong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10
  }

 })

     // add an event listner for tag
     document.querySelector(".cardcontainer").addEventListener("click", () => {
      document.querySelector(".left").style.left = "0";
      console.log("hello been clicked")
    });


}

main();
