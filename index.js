require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const qs = require('querystring');
const { WebClient } = require('@slack/web-api');
const axios = require('axios');

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/challenge', (req, res) => {
  const { challenge } = req.body;
  res.send(challenge)
})

app.get('/oauth/redirect', async (req, res) => {
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
  console.log(`response: ${JSON.stringify(response.data)}`)
  // TODO: store team
  res.send('successful')
})

app.post('/command/coffee', async (req, res) => {
  console.log(JSON.stringify(req.body))
  // TODO: store user
  res.send('sent coffee command')
})

app.get('/command/match', (req, res) => {
  try {
    // TODO: get token!
    const token = ''
    // TODO: match people
    const user1, user2 = ''
    const users = [user1, user2].join(',')
    const text = 'I have matched you with a rad person! Go have coffee'
    const web = new WebClient(token);
    const convo = await web.conversations.open({ token, users });
    const channel = convo.channel.id
    await web.chat.postMessage({ channel, text });
  } catch(e) {
    console.log(e)
  }
  res.send('sent coffee command')
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`))

// TODO: create cron job to send messages
  // TODO: write algorithm to choose someone not chosen before
    // - transform list of people into sub-array of least talked to people, pick a random one, increment the convo count with that person
  // TODO: Create nicely formatted message - contains link and topic to break the ice
  // TODO: add sub command for unsubscribing
  // TODO: add sub to see previous conversations