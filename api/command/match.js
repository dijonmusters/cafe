const { sendMatchMessages } = require('../_utils/matcher')

module.exports = async (req, res) => {
  try {
    const { secret } = req.body
    if (secret === process.env.MATCH_SECRET) {
      console.log('matching')
      const matches = await sendMatchMessages()
      console.log('matched')
      res.send({ matches })
    } else {
      console.log('failed to match')
      res.status(401).send('failed to authenticate')
    }
  } catch (e) {
    console.log(e)
    res.status(500).send('failed to send coffee dates')
  }
}
