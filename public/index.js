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

  receiveUserMessage()
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


const receiveUserMessage = () => {
  // 用户输入
  const textDom = $('input')
  $('html').keydown(e => {
    if (e.which === 13 && textDom.val() !== '') {
      console.log(textDom.val())
      socket.emit('message', textDom.val())
      textDom.val('')
    }
  })

  socket.on('createMessage', msg => {
    // console.log('server MSG!!!', msg)
    const now = Date().toLocaleString().substring(0, 24)
    $('.chat-messages').append(`<li class="user-message"><b>用户</b>--<span class="time">${now}</span><br/>${msg}</li>`)
  })
}