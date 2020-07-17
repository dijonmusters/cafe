const express = require('express')

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/test', (req, res) => {
  res.send('working')
});

app.post('/slack/challenge', (req, res) => {
  console.log('received')
  const { body } = req;
  console.log(body)
  res.send()
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`))