const shuffle = require('lodash/shuffle')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const removeVacatedStaff = (workspaceUsers, previousMatches) => {
  const currentStaffIds = workspaceUsers.map((user) => user.slackId)
  return previousMatches.filter((match) =>
    currentStaffIds.includes(match.guest.slackId)
  )
}

const getRandomUser = (list) => {
  if (list.length > 0) {
    return list[Math.floor(Math.random() * Math.floor(list.length))]
  } else {
    return null
  }
}

const getAvailableUsers = (users, matched) =>
  users.filter((user) => !matched.includes(user.slackId))

const getMatches = (subscribedUsers, workspaceUsers) => {
  const matched = []

  return shuffle(subscribedUsers)
    .map((user) => ({
      // add previous matches
      ...user,
      matched: removeVacatedStaff(workspaceUsers, user.matches).reduce(
        // create histogram
        (acc, curr) =>
          acc[curr.guest.slackId]
            ? { ...acc, [curr.guest.slackId]: acc[curr.guest.slackId] + 1 }
            : { ...acc, [curr.guest.slackId]: 1 },
        {}
      ),
    }))
    .map((user) => {
      // add no matches
      const allUsers = workspaceUsers.map((u) => u.slackId)
      const unmatched = allUsers.reduce(
        (acc, curr) =>
          curr !== user.slackId && !user.matched[curr]
            ? { ...acc, [curr]: 0 }
            : acc,
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
      if (matched.includes(currentUser.slackId)) return matchAcc
      matched.push(currentUser.slackId)
      let match = null
      for (const tier of currentUser.tiers) {
        // iterate through tiers of preferences and try to find a match
        const availableUsers = getAvailableUsers(tier, matched)
        match = getRandomUser(availableUsers)
        if (match) {
          matched.push(match)
          const { id, slackId, username } = workspaceUsers.find(
            (user) => user.slackId === match
          )
          match = { id, slackId, username }
          break
        }
      }
      const { id, slackId, username } = currentUser
      return [...matchAcc, { user1: { id, slackId, username }, user2: match }]
    }, [])
}

const getAllMatches = async () => {
  const teamsWithUsersAndMatches = await prisma.team.findMany({
    select: {
      token: true,
      users: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          slackId: true,
          username: true,
          isSubscribed: true,
          matches: {
            where: {
              guestId: {
                not: null,
              },
            },
            select: {
              guest: {
                select: {
                  slackId: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return await Promise.all(
    teamsWithUsersAndMatches.map(async ({ users, token }) => {
      const subscribedUsers = users.filter((user) => user.isSubscribed)
      const matches = getMatches(subscribedUsers, users)
      return {
        token,
        matches,
      }
    })
  )
}

const writeMatchesToDb = async (allMatches) => {
  const flatMatches = allMatches
    .reduce((acc, { matches }) => [...acc, ...matches], [])
    .map(({ user1, user2 }) => ({
      userId: user1.id,
      guestId: user2 ? user2.id : null, // TODO! is this actually needed? Check if user2 is already null
    }))

  return await prisma.match.createMany({
    data: flatMatches,
  })
}

module.exports = {
  getAllMatches,
  writeMatchesToDb,
}
