const socket = io('/')
const videoGridDom = document.getElementById('video-grid')
let videoDom = document.createElement('video')
videoDom.muted = true

const myPeer = new Peer(undefined, {
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
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {
    // delay the call
    setTimeout(() => {
      connectToNewUser(userId, stream)
    }, 1500)
  })
})

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

myPeer.on('open', id => {
  socket.emit('join-room', WINDOW_ROOM_ID, id) 
})


function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGridDom.append(video)
}