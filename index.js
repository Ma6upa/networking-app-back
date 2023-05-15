const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
)

const app = express()
const PORT = config.get('port')

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/posts', require('./routes/posts.routes'))
app.use(express.static(__dirname + '/images'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'))
    app.listen(PORT, () => console.log('app working on port', PORT))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
