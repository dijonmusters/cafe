const express = require('express')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.get('/test', (req, res) => {
  res.send('working')
})

app.post('/slack/challenge', (req, res) => {
  const { challenge } = req.body;
  res.send(challenge)
})

app.post('/command/coffee', (req, res) => {
  res.send('sent coffee command')
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`))