console.log(`Welcome to the server!`)
const videoGridDom = document.getElementById('video-grid')
let videoDom = document.createElement('video')
videoDom.muted = true

let videoStream = null;

navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
}).then(stream => {
  videoStream = stream
  addVideoStream(videoDom, stream)
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGridDom.append(video)
}