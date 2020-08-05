import { formatDistanceToNow, setMinutes, setHours, format } from 'date-fns'

const join = `You have entered the cafe`
const leave = `You have left the cafe`

const help = `:coffee: \`/cafe join\`\n:non-potable_water: \`/cafe leave\`\n:man_and_woman_holding_hands: \`/cafe list\``

const generate = require('project-name-generator');

const random = arr => arr[Math.floor(Math.random() * Math.floor(arr.length))]

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min)
}

const list = (matches) => {
  const responses = matches.map(m => `${m.guest.username} (${formatDistanceToNow(m.date)} ago)`).join('\n')
  return responses.length > 0
    ? responses
    : `You have not matched with anyone yet, but I'm sure there is someone out there for you!`
}

const matchedOptions = [
  `I found you such a cool coffee buddy. Here let me introduce you both. I think you're really going to hit it off!`,
  `You two have so much in common! I'm pretty sure you work together. You should catch up today!`,
  `Wow, what a match. Go grab a coffee you two!`,
]

const lonelyOptions = [
  `Unfortunately, I have not been able to match you with someone today. It's a failing on my part, not you! Sorry ❤️`,
  `Oh no, I couldn't find a match! Looks like it's just me and you today!`,
  `I failed to find you a coffee buddy. I must have forgotten to carry a one somewhere!`,
]

const topicOptions = [
  `What were the highest and lowest points of your life?`,
  `What is your favourite conspiracy theory, and why?`,
  `What is your ultimate career end goal?`,
  `When was the last time you changed your opinion on something significant`,
  `What is something you will definitely never do again?`,
  `What's your least significant achievement that you are most proud of?`,
  `What is a song or artist you are embarrassed about really liking?`,
]

const getMeetingUrl = () => `https://converse.now.sh/${generate().dashed}`
const getTime = () => {
  return format(
    setHours(
      setMinutes(
        Date.now(),
        randomBetween(0, 59)
      ),
      randomBetween(10, 16)
    ),
    'H:mm'
  )
}

const getMatchedText = () => `:man_and_woman_holding_hands: ${random(matchedOptions)}\n\n\n:timer_clock: Time: ${getTime()}\n\n\n:round_pushpin: Place: \`${getMeetingUrl()}\`\n\n\n:bulb: Topic: _${random(topicOptions)}_`
const getLonelyText = () => random(lonelyOptions)

module.exports = {
  join,
  leave,
  list,
  help,
  getLonelyText,
  getMatchedText
}