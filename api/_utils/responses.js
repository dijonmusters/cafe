const join = `You have entered the cafe`
const leave = `You have left the cafe`

const help = `Want some help?
  :coffee: \`/cafe join\`
  :non-potable_water: \`/cafe leave\`
  :man_and_woman_holding_hands: \`/cafe list\`
`

const list = (matches) => {
  return 'you matched'
}

module.exports = {
  join,
  leave,
  list,
  help
}