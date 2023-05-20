const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const https = require("https")
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = config.get('port')

app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"],
    exposedHeaders: ["authorization"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
)

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/posts', require('./routes/posts.routes'))
app.use(express.static(__dirname + '/images'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'))
    const sslServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app)
    sslServer.listen(PORT, () => console.log('app working on port', PORT))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
