const express = require('express');

const app = express();

const server = require('http').Server(app);


const { v4: uuidv4 } = require('uuid');

// 静态文件夹
app.use(express.static('public'));

// 模板
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // res.status(200).send('Hello World!');
  res.redirect(`/${uuidv4()}`)
})

app.get('/:roomId', (req, res) => {
  res.render('room', { roomId: req.params.roomId })
})

server.listen(2024, () => {
  console.log('Server running on port 2024\n http://localhost:2024');
})