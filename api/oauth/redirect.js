const axios = require('axios')
const qs = require('querystring')
const { PrismaClient } = require('@prisma/client')

module.exports = async (req, res) => {
  const prisma = new PrismaClient()

  const addTeam = async (team) => {
    const data = {
      slackId: team.team.id,
      name: team.team.name,
      token: team.access_token,
    }

    return await prisma.team.create({
      data,
    })
  }

  try {
    const { code } = req.query
    const url = 'https://slack.com/api/oauth.v2.access'
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    })
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const response = await axios.post(url, data, { headers })
    await addTeam(response.data)
    res.status(301)
    res.setHeader(
      'Location',
      'https://slack-cafe.vercel.app?installation=success'
    )
    res.send('Successfully installed Cafe app')
  } catch (e) {
    console.log(e)
    res.status(301)
    res.setHeader(
      'Location',
      'https://slack-cafe.vercel.app?installation=failure'
    )
    res.send('Failed to install Cafe app')
  }
}
