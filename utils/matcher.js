const { WebClient } = require('@slack/web-api');
const { getTeams, getTeamMembers } = require('./db')

const getRandomUser = (list, matched) => {
  const availableUsers = list.filter(u => !matched.includes(u))
  if (availableUsers.length > 0) {
    return availableUsers[Math.floor(Math.random() * Math.floor(availableUsers.length))]
  } else {
    return null
  }
}

const getMatches = (list) => {
  const matched = []
  return list.reduce((acc, curr) => {
    if (matched.includes(curr)) return acc
    matched.push(curr)
    const match = getRandomUser(list, matched)
    matched.push(match)
    return [...acc, { user1: curr, user2: match }]
  }, [])
}

const getAllMatches = async () => {
  const teams = await getTeams()
  const teamMembers = await Promise.all(teams.map(async ({ id, botToken }) => {
    const teamData = await getTeamMembers(id)
    const team = teamData.map(m => m.id)
    return {
      botToken,
      team
    }
  }))
  return teamMembers.map(({ team, botToken }) => {
    const matches = getMatches(team)
    return {
      botToken,
      matches
    }
  })
}

const matchedText = `
  You have matched with this wonderful person! Enjoy your date!
`

const lonelyText = `
  Unfortunately you have not matched with anyone this time around
`

const getMessageData = match => {
  const { user1, user2 } = match
  return (user1 && user2)
    ? {
      users: `${user1},${user2}`,
      text: matchedText
    } : {
      users: `${user1}`,
      text: lonelyText
    }
}

const sendMatchMessages = async () => {
  const allMatches = await getAllMatches()
  await Promise.all(allMatches.map(async ({ botToken, matches }) => {
    const web = new WebClient(botToken)
    return matches.map(async match => {
      const { users, text } = getMessageData(match)
      const convo = await web.conversations.open({ token: botToken, users })
      const channel = convo.channel.id
      await web.chat.postMessage({ channel, text });
    })
  }))
}

module.exports = {
  sendMatchMessages,
  getMatches
}