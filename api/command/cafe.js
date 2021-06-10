const { parser } = require('../_utils/command')

module.exports = async (req, res) => {
  try {
    const response = await parser(req.body)
    res.send(response)
  } catch (e) {
    console.log(e)
    res.status(500).send('failed to subscribe you')
  }
}
