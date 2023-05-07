const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
const PORT = config.get('port')

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))

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
