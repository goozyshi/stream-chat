const socket = io('/')
console.log(`Welcome to the server!`)
const videoGridDom = document.getElementById('video-grid')
let videoDom = document.createElement('video')
videoDom.muted = true

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: 2024
});

let videoStream = null;

navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
}).then(stream => {
  videoStream = stream
  addVideoStream(videoDom, stream)
})

socket.emit('join-room', WINDOW_ROOM_ID) 

socket.on('user-connected', () => {
  console.log(`????`)
  connectToNewUser()
})

const connectToNewUser = () => {
  console.log('new user connected')
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGridDom.append(video)
}