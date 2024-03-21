const express = require('express');

const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const { v4: uuidv4 } = require('uuid');

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
})

// 静态文件夹
app.use(express.static('public'));
app.use('/peerjs', peerServer);

// 模板
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // res.status(200).send('Hello World!');
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
  })
})

server.listen(2024, () => {
  console.log('Server running on port 2024\n http://localhost:2024');
})