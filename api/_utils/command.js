const { addUser, removeUser, getMatches } = require('./db')
const { join, leave, help, list } = require('./responses')

const parser = async (data) => {
  const { text: command } = data

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
