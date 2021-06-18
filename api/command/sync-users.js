const { PrismaClient } = require('@prisma/client')
const { WebClient } = require('@slack/web-api')

module.exports = async (req, res) => {
  const prisma = new PrismaClient()
  try {
    const { secret } = req.body
    if (secret === process.env.MATCH_SECRET) {
      const teamsWithUsers = await prisma.team.findMany({
        include: {
          users: true,
        },
      })

      const updates = await Promise.all(
        teamsWithUsers.map(async (team) => {
          const web = new WebClient(team.token)
          const allWorkspaceUsers = await web.users.list()
          const workspaceUsers = allWorkspaceUsers.members
            .filter(
              (user) =>
                !user.deleted &&
                !user.is_bot &&
                !user.is_app_user &&
                user.name !== 'slackbot' &&
                !user.is_restricted &&
                !user.is_ultra_restricted
            )
            .map(({ id, name }) => ({
              slackId: id,
              username: name,
            }))

          const usersToDelete = team.users.filter(
            // users who are in cafe db but not in slack
            (user) => {
              const found = !workspaceUsers.find(
                (workspaceUser) => workspaceUser.slackId !== user.slackId
              )

              return found && !found.isDeleted
            }
          )

          const usersToUndelete = workspaceUsers.filter((workspaceUser) => {
            const found = team.users.find(
              (user) => user.slackId === workspaceUser.slackId
            )
            return found && found.isDeleted
          })

          const usersToCreate = workspaceUsers.filter(
            (workspaceUser) =>
              !team.users.find((user) => user.slackId === workspaceUser.slackId)
          )

          const updatePromises = []

          usersToDelete.forEach(({ slackId }) =>
            updatePromises.push(
              prisma.user.update({
                where: {
                  slackId,
                },
                data: {
                  isDeleted: true,
                },
              })
            )
          )

          usersToUndelete.forEach(({ slackId }) =>
            updatePromises.push(
              prisma.user.update({
                where: {
                  slackId,
                },
                data: {
                  isDeleted: false,
                },
              })
            )
          )

          usersToCreate.forEach(({ slackId, username }) =>
            updatePromises.push(
              prisma.user.create({
                slackId,
                username,
              })
            )
          )

          return await Promise.all(updatePromises)
        })
      )

      res.send({ updates })
    } else {
      console.log('failed to sync')
      res.status(401).send('failed to authenticate')
    }
  } catch (e) {
    console.log(e)
    res.status(500).send('failed to sync users')
  }
}
