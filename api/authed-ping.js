module.exports = (req, res) => {
  try {
    const { secret } = req.body
    if (secret === process.env.MATCH_SECRET) {
      res.send('authed pong')
    } else {
      res.status(401).send('you are not authed')
    }
  } catch (e) {
    res.status(500).send('you crashed while playing authed ping pong')
  }
}
