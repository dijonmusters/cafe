const { addUser } = require('../_utils/db')

module.exports = async (req, res) => {
  try {
    await addUser(req.body)
    res.send('subscribed')
  } catch(e) {
    console.log(e)
    res.send('failed to subscribe you')
  }
}