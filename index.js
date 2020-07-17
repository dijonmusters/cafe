const express = require('express')

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/test', (req, res) => {
  res.send('working')
});

app.post('/slack/challenge', (req, res) => {
  const { challenge } = req.body;
  res.send(challenge)
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`))