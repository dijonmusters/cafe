import { formatDistanceToNow } from 'date-fns'

const join = `You have entered the cafe`
const leave = `You have left the cafe`

const help = `:coffee: \`/cafe join\`\n:non-potable_water: \`/cafe leave\`\n:man_and_woman_holding_hands: \`/cafe list\``

const list = (matches) => {
  return matches.map(m => `${m.guest.username} (${formatDistanceToNow(m.date)} ago)`).join('\n')
}

module.exports = {
  join,
  leave,
  list,
  help
}