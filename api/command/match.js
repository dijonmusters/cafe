const { sendMatchMessages } = require('../_utils/matcher')

module.exports = async (req, res) => {
  try {
    await sendMatchMessages()
    res.send('sent all coffee dates')
  } catch(e) {
    console.log(e)
    res.send('failed to send coffee dates')
  }
}