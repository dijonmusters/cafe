const { sendMatchMessages } = require('../_utils/matcher')

module.exports = async (req, res) => {
  try {
    const { secret } = req.body
    if (secret === process.env.MATCH_SECRET) {
      await sendMatchMessages()
      res.send('sent all coffee dates')
    } else {
      res.send('failed to send coffee dates')
    }
  } catch(e) {
    console.log(e)
    res.send('failed to send coffee dates')
  }
}