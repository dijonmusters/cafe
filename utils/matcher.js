const { WebClient } = require('@slack/web-api');
const { getTeams, getTeamMembers } = require('./db')

const getRandomUser = (users) => {
  if (users.length > 0) {
    return users[Math.floor(Math.random() * Math.floor(users.length))]
  } else {
    return null
  }
}

const getMatches = (list) => {
  let users = [...list]
  return users.reduce((acc, curr) => {
    if (!users.includes(curr)) return acc
    users = users.filter(u => u !== curr)
    const match = getRandomUser(users)
    users = users.filter(u => u !== match)
    return [...acc, { user1: curr, user2: match }]
  }, [])
}

const getAllMatches = async () => {
  const teams = await getTeams()
  const teamMembers = await Promise.all(teams.map(async ({ id, token }) => {
    const team = await getTeamMembers(id)
    return {
      id,
      token,
      team
    }
  }))
  return teamMembers.map(({ team, token}) => {
    const matches = getMatches(team)
    return {
      token,
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
      users: `${user1.id},${user2.id}`,
      text: matchedText
    } : {
      users: `${user1.id}`,
      text: lonelyText
    }
}

const sendMatchMessages = async () => {
  const allMatches = await getAllMatches()
  await Promise.all(allMatches.map(async ({ token, matches }) => {
    const web = new WebClient(token);
    return matches.map(async match => {
      const { users, text } = getMessageData(match)
      const convo = await web.conversations.open({ token, users })
      const channel = convo.channel.id
      await web.chat.postMessage({ channel, text });
    })
  }))
}

module.exports = {
  sendMatchMessages
}