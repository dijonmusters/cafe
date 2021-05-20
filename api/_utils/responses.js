import { formatDistanceToNow, setMinutes, setHours, format } from 'date-fns'

const join = `You have entered the cafe`
const leave = `You have left the cafe`

const help = `:coffee: \`/cafe join\`\n:non-potable_water: \`/cafe leave\`\n:man_and_woman_holding_hands: \`/cafe list\``

const generate = require('project-name-generator')

const random = (arr) => arr[Math.floor(Math.random() * Math.floor(arr.length))]

const randomBetween = (min, max) => {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) +
    Math.ceil(min)
  )
}

const list = (matches) => {
  const responses = matches
    .map((m) => `${m.guest.username} (${formatDistanceToNow(m.date)} ago)`)
    .join('\n')
  return responses.length > 0
    ? responses
    : `You have not matched with anyone yet, but I'm sure there is someone out there for you!`
}

const matchedOptions = [
  `I found you such a cool coffee buddy. Here let me introduce you both. I think you're really going to hit it off!`,
  `You two have so much in common! I'm pretty sure you work together. You should catch up today!`,
  `Wow, what a match. Go grab a coffee you two!`,
  `I have really outdone myself this time. I think you two are going to like each other a lot!`,
  `Did someone ace their science class, because you two definitely have chemistry!`,
  `I haven't had too much time to research you both, so maybe you should ask the questions!`,
]

const lonelyOptions = [
  `Unfortunately, I have not been able to match you with someone this week. It's a failing on my part, not you! Sorry ❤️`,
  `Oh no, I couldn't find a match! Looks like it's just me and you this week!`,
  `I failed to find you a coffee buddy. I must have forgotten to carry a one somewhere!`,
  `I thought I had someone you should meet but they disappeared at the last minute! I'll hook you up next week!`,
  `The magic eight ball says you are going to have a lonely week of coffees. Okay fine, the magic eight ball is me. I'm sorry I failed to match you 😭`,
]

const topicOptions = [
  `What were the highest and lowest points of your life?`,
  `What is your favourite conspiracy theory, and why?`,
  `What is your ultimate career goal?`,
  `When was the last time you changed your opinion on something significant`,
  `What is something you will definitely never do again?`,
  `What's your least significant achievement that you are most proud of?`,
  `What is a song or artist you are embarrassed about really liking?`,
  `What is an example of a time you have been super lucky in your life?`,
  `What is an example of a time you have been super unlucky in your life?`,
  `What achievement, personality trait or accomplishment are you most proud of?`,
  `What is something you avoid in your life?`,
  `Who are three of your closest friends, and what do you like about them?`,
  `What small or inexpensive things make you unusually happy?`,
  `What would you tell your child is the absolute most important thing in life?`,
  `If you end up in a negative thought spiral, what sorts of things does your mind focus on?`,
  `What was the most recent thing that you were super proud of yourself for?`,
  `Ignoring feasibility, what is something you would like to change in your life?`,
  `What is something your parents never quite understood about you?`,
  `What mistakes would you avoid in a future relationship?`,
  `What's the most useful career advice you have ever received?`,
  `What have you found to be the most positive and negative things to come from this pandemic?`,
]

const days = ['Friday']

const getMeetingUrl = () => `https://converse.now.sh/${generate().dashed}`
const getTime = () => {
  return format(
    setHours(
      setMinutes(Date.now(), randomBetween(0, 59)),
      randomBetween(11, 15)
    ),
    'H:mm'
  )
}

const getDay = () => random(days)

const emergencyMatchOption = [
  `My creator was too busy to notice I failed to match people this week. Tomorrow is a good day for it though. I heard the weather is going to be ... okay.`,
]

const emergencyLonelyOption = [
  `I have been trying all week but failed to find you a match. Next week! I promise!`,
]

const useEmergencyText = true // flip this to send a specific message

const getMatchedText = () =>
  `:man_and_woman_holding_hands: ${random(
    useEmergencyText ? emergencyMatchOption : matchedOptions
  )}\n\n\n:timer_clock: Time: ${getDay()} ${getTime()}\n\n\n:bulb: Topic: _${random(
    topicOptions
  )}_`
const getLonelyText = () =>
  random(useEmergencyText ? emergencyLonelyOption : lonelyOptions)

module.exports = {
  join,
  leave,
  list,
  help,
  getLonelyText,
  getMatchedText,
}
