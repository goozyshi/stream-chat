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


const changeMuteStatus = () => {
  const enabled = videoStream.getAudioTracks()[0].enabled;
  let html = `
    <i class="iconfont icon-huatong"></i>
    <span>静音</span>
  `
  if (enabled) {
    videoStream.getAudioTracks()[0].enabled = false;
  } else {
    videoStream.getAudioTracks()[0].enabled = true;
  }
  if (enabled) {
    html = `
    <i class="iconfont icon-jingyin"></i>
    <span>开启话筒</span>
    `
  }

  document.querySelector('.control__button--voice').innerHTML = html;
}

const changeVideoStatus = () => {
  let html =`
    <i class="iconfont icon-shexiangtou"></i>
    <span>视频</span>
  `
  let enabled = videoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    videoStream.getVideoTracks()[0].enabled = false;
  } else {
    videoStream.getVideoTracks()[0].enabled = true;
  }
  if (enabled) {
    html = `
      <i class="iconfont icon-shexiangtou_guanbi"></i>
      <span>开启摄像头</span>
    `
  }
  document.querySelector('.control__button--video').innerHTML = html;
}