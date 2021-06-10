const { join, leave, help, list } = require('./responses')
const { PrismaClient } = require('@prisma/client')

const parser = async (data) => {
  const prisma = new PrismaClient()
  const { text: command } = data

  const addUser = async ({
    user_id: slackId,
    user_name: username,
    team_id: teamSlackId,
  }) => {
    const team = await prisma.team.findUnique({
      where: {
        slackId: teamSlackId,
      },
      select: {
        id: true,
      },
    })
    return await prisma.user.upsert({
      where: {
        slackId,
      },
      update: {
        isSubscribed: true,
        isDeleted: false,
      },
      create: {
        slackId,
        username,
        teamId: team.id,
        isSubscribed: true,
      },
    })
  }

  const removeUser = async ({ user_id: slackId }) =>
    await prisma.user.update({
      where: {
        slackId,
      },
      data: {
        isSubscribed: false,
        isDeleted: true,
      },
    })

  const getMatches = async ({ user_id: slackId }) => {
    const user = await prisma.user.findUnique({
      where: {
        slackId,
      },
      select: {
        matches: {
          where: {
            guestId: {
              not: null,
            },
          },
          select: {
            createdAt,
            guest: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    })

    return user.matches
  }

  switch (command) {
    case 'join':
      await addUser(data)
      return join
    case 'leave':
      await removeUser(data)
      return leave
    case 'list':
      const matches = await getMatches(data)
      return list(matches)
    default:
      return help
  }
}

module.exports = {
  parser,
}
