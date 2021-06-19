const { WebClient } = require('@slack/web-api')
const { getMatchedText, getLonelyText } = require('./responses')

const getUserString = ({ user1, user2 }) => {
  if (user1 || user2) {
    return user1 && user2
      ? `${user1.slackId},${user2.slackId}`
      : `${user1.slackId}`
  }
}

const getConversationText = ({ user1, user2 }) =>
  user1 && user2 ? getMatchedText() : getLonelyText()

const sendMatchMessages = async (allMatches) =>
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

export { sendMatchMessages }
