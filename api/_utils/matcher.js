const { WebClient } = require('@slack/web-api')
const shuffle = require('lodash/shuffle')
const { getTeams, getTeamMembers, addMatches } = require('./db')
const { getMatchedText, getLonelyText } = require('./responses')

const vacatedStaff = [
  'U02DGT7RR', // mtcmorris
  'UNX8L8GGK', // james.adams
  'UCTTQCLFJ', // andrei.gridnev
]

const removeVacatedStaff = (users) => {
  return users.filter((user) => !vacatedStaff.includes(user.guest.id))
}

const getRandomUser = (list) => {
  if (list.length > 0) {
    return list[Math.floor(Math.random() * Math.floor(list.length))]
  } else {
    return null
  }
}

const getAvailableUsers = (users, matched) =>
  users.filter((user) => !matched.includes(user))

const getMatches = (team) => {
  const matched = []

  return shuffle(team)
    .map((user) => ({
      // add previous matches
      ...user,
      matched: removeVacatedStaff(user.matched).reduce(
        (acc, curr) =>
          acc[curr.guest.id]
            ? { ...acc, [curr.guest.id]: acc[curr.guest.id] + 1 }
            : { ...acc, [curr.guest.id]: 1 },
        {}
      ),
    }))
    .map((user) => {
      // add no matches
      const allUsers = team.map((u) => u.id)
      const unmatched = allUsers.reduce(
        (acc, curr) =>
          curr !== user.id && !user.matched[curr] ? { ...acc, [curr]: 0 } : acc,
        {}
      )
      return {
        ...user,
        matched: { ...user.matched, ...unmatched },
      }
    })
    .map((user) => {
      // add tiers of preferences
      const uniques = [
        ...new Set(Object.keys(user.matched).map((key) => user.matched[key])),
      ].sort()

      const tiers = uniques.map((value) => {
        return Object.keys(user.matched).filter(
          (key) => user.matched[key] === value
        )
      })

      return {
        ...user,
        tiers,
      }
    })
    .reduce((matchAcc, currentUser) => {
      // pick a match
      if (matched.includes(currentUser.id)) return matchAcc
      matched.push(currentUser.id)
      let match = null
      for (const tier of currentUser.tiers) {
        // iterate through tiers of preferences and try to find a match
        const availableUsers = getAvailableUsers(tier, matched)
        match = getRandomUser(availableUsers)
        if (match) {
          matched.push(match)
          break
        }
      }
      return [...matchAcc, { user1: currentUser.id, user2: match }]
    }, [])
}

const getAllMatches = async () => {
  const teams = await getTeams()
  const teamMembers = await Promise.all(
    teams.map(async ({ id, token }) => {
      const teamData = await getTeamMembers(id)
      const team = teamData.map((m) => ({
        id: m.id,
        matched: m.matched,
      }))
      return {
        token,
        team,
      }
    })
  )
  return teamMembers.map(({ team, token }) => {
    const matches = getMatches(team)
    return {
      token,
      matches,
    }
  })
}

const getUserString = ({ user1, user2 }) => {
  if (user1 || user2) {
    return user1 && user2 ? `${user1},${user2}` : `${user1}`
  }
}

const getConversationText = ({ user1, user2 }) =>
  user1 && user2 ? getMatchedText() : getLonelyText()

const sendMatchMessages = async () => {
  const allMatches = await getAllMatches()
  if (allMatches.length > 0) {
    await addMatches(allMatches)
    await Promise.all(
      allMatches.map(async ({ token, matches }) => {
        const web = new WebClient(token)
        return Promise.all(
          matches.map(async (match) => {
            const users = getUserString(match)
            if (users) {
              const text = getConversationText(match)
              const convo = await web.conversations.open({ token, users })
              const channel = convo.channel.id
              await web.chat.postMessage({ channel, text })
            }
          })
        )
      })
    )
  }
  return allMatches
}

module.exports = {
  sendMatchMessages,
}
