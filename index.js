require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const qs = require('querystring');
const axios = require('axios');
const { addTeam, addUser } = require('./utils/db')
const { sendMatchMessages, getMatches } = require('./utils/matcher')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/challenge', (req, res) => {
  const { challenge } = req.body;
  res.send(challenge)
})

app.get('/oauth/redirect', async (req, res) => {
  try {
    const { code } = req.query
    const url ="https://slack.com/api/oauth.access"
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const response = await axios.post(url, data, { headers })
    await addTeam(response.data)
    res.send('successfully installed Cafe app')
  } catch(e) {
    console.log(e)
    res.send('Failed to install Cafe app')
  }
})

app.post('/command/coffee', async (req, res) => {
  try {
    await addUser(req.body)
    res.send('subscribed')
  } catch(e) {
    console.log(e)
    res.send('failed to subscribe you')
  }
})

app.get('/command/match', async (req, res) => {
  try {
    await sendMatchMessages()
    res.send('sent all coffee dates')
  } catch(e) {
    console.log(e)
    res.send('failed to send coffee dates')
  }
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`))

// TODO: rebuild as serverless on now.sh
// TODO: create cron job to send messages
// TODO: write algorithm to choose someone not chosen before
  // - transform list of people into sub-array of least talked to people, pick a random one, increment the convo count with that person
// TODO: Create nicely formatted message - contains link and topic to break the ice
// TODO: add sub commands
// TODO: redirect team signup nicely
// TODO: look into permissions - make sure they match