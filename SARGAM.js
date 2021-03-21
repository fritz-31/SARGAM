/* Drum*/
var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numberOfDrumButtons; i++) {

  document.querySelectorAll(".drum")[i].addEventListener("click", function() {

    var buttonInnerHTML = this.innerHTML;

    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);

  });

}

document.addEventListener("keypress", function(event) {

  makeSound(event.key);

  buttonAnimation(event.key);

});


function makeSound(key) {

  switch (key) {
    case "w":
      var tom1 = new Audio("sounds/crash.mp3");
      tom1.play();
      break;

    case "a":
      var tom2 = new Audio("sounds/kick-bass.mp3");
      tom2.play();
      break;

    case "q":
      var tom3 = new Audio('sounds/snare.mp3');
      tom3.play();
      break;

    case "x":
      var tom4 = new Audio('sounds/tom-1.mp3');
      tom4.play();
      break;

    case "c":
      var snare = new Audio('sounds/tom-2.mp3');
      snare.play();
      break;

    case "v":
      var crash = new Audio('sounds/tom-3.mp3');
      crash.play();
      break;

    case "b":
      var kick = new Audio('sounds/tom-4.mp3');
      kick.play();
      break;

      case "s":
      var kick = new Audio('sounds/PIANO/c4.mp3');
      kick.play();
      break;

      case "r":
        var kick = new Audio('sounds/PIANO/d4.mp3');
        kick.play();
        break;

        case "g":
      var kick = new Audio('sounds/PIANO/e4.mp3');
      kick.play();
      break;

      case "m":
      var kick = new Audio('sounds/PIANO/f4.mp3');
      kick.play();
      break;

      case "p":
      var kick = new Audio('sounds/PIANO/g4.mp3');
      kick.play();
      break;

      case "d":
      var kick = new Audio("sounds/PIANO/a5.mp3");
      kick.play();
      break;

      case "n":
      var kick = new Audio('sounds/PIANO/b5.mp3');
      kick.play();
      break;

  


    default: console.log(key);

  }
}


function buttonAnimation(currentKey) {

  var activeButton = document.querySelector("." + currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);

}

let constraintObj = { 
  audio: false, 
  video: { 
      facingMode: "user", 
      width: { min: 640, ideal: 640, max: 720 },
      height: { min: 480, ideal: 400, max: 720 } 
  } 
}; 
// width: 1280, height: 720  -- preference only
// facingMode: {exact: "user"}
// facingMode: "environment"

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = function(constraintObj) {
      let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraintObj, resolve, reject);
      });
  }
}else{
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
      devices.forEach(device=>{
          console.log(device.kind.toUpperCase(), device.label);
          //, device.deviceId
      })
  })
  .catch(err=>{
      console.log(err.name, err.message);
  })
}

navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
  //connect the media stream to the first video element
  let video = document.querySelector('video');
  if ("srcObject" in video) {
      video.srcObject = mediaStreamObj;
  } else {
      //old version
      video.src = window.URL.createObjectURL(mediaStreamObj);
  }
  
  video.onloadedmetadata = function(ev) {
      //show in the video element what is being captured by the webcam
      video.play();
  };
  
  //add listeners for saving video/audio
  let start = document.getElementById('btnStart');
  let stop = document.getElementById('btnStop');
  let vidSave = document.getElementById('vid2');
  let mediaRecorder = new MediaRecorder(mediaStreamObj);
  let chunks = [];
  
  start.addEventListener('click', (ev)=>{
      mediaRecorder.start();
      console.log(mediaRecorder.state);
  })
  stop.addEventListener('click', (ev)=>{
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
  });
  mediaRecorder.ondataavailable = function(ev) {
      chunks.push(ev.data);
  }
  mediaRecorder.onstop = (ev)=>{
      let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
      chunks = [];
      let videoURL = window.URL.createObjectURL(blob);
      vidSave.src = videoURL;
  }
})
.catch(function(err) { 
  console.log(err.name, err.message); 
});

jQuery(document).ready(function () {
  var $ = jQuery;
  var myRecorder = {
      objects: {
          context: null,
          stream: null,
          recorder: null
      },
      init: function () {
          if (null === myRecorder.objects.context) {
              myRecorder.objects.context = new (
                      window.AudioContext || window.webkitAudioContext
                      );
          }
      },
      start: function () {
          var options = {audio: true, video: false};
          navigator.mediaDevices.getUserMedia(options).then(function (stream) {
              myRecorder.objects.stream = stream;
              myRecorder.objects.recorder = new Recorder(
                      myRecorder.objects.context.createMediaStreamSource(stream),
                      {numChannels: 1}
              );
              myRecorder.objects.recorder.record();
          }).catch(function (err) {});
      },
      stop: function (listObject) {
          if (null !== myRecorder.objects.stream) {
              myRecorder.objects.stream.getAudioTracks()[0].stop();
          }
          if (null !== myRecorder.objects.recorder) {
              myRecorder.objects.recorder.stop();

              // Validate object
              if (null !== listObject
                      && 'object' === typeof listObject
                      && listObject.length > 0) {
                  // Export the WAV file
                  myRecorder.objects.recorder.exportWAV(function (blob) {
                      var url = (window.URL || window.webkitURL)
                              .createObjectURL(blob);

                      // Prepare the playback
                      var audioObject = $('<audio controls></audio>')
                              .attr('src', url);

                      // Prepare the download link
                      var downloadObject = $('<a>&#9660;</a>')
                              .attr('href', url)
                              .attr('download', new Date().toUTCString() + '.wav');

                      // Wrap everything in a row
                      var holderObject = $('<div class="row"></div>')
                              .append(audioObject)
                              .append(downloadObject);

                      // Append to the list
                      listObject.append(holderObject);
                  });
              }
          }
      }
  };

  // Prepare the recordings list
  var listObject = $('[data-role="recordings"]');

  // Prepare the record button
  $('[data-role="controls"] > button').click(function () {
      // Initialize the recorder
      myRecorder.init();

      // Get the button state 
      var buttonState = !!$(this).attr('data-recording');

      // Toggle
      if (!buttonState) {
          $(this).attr('data-recording', 'true');
          myRecorder.start();
      } else {
          $(this).attr('data-recording', '');
          myRecorder.stop(listObject);
      }
  });
});




