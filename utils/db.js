const faunadb = require('faunadb')
const { query: q } = faunadb

const client = new faunadb.Client({
  secret: process.env.FAUNA_DB,
})

const addTeam = async (team) => {
  const data = {
    id: team.team_id,
    name: team.team_name,
    token: team.access_token
  }
  const document = await client.query(
    q.Create(q.Collection('teams'), { data })
  )

  return {
    id: document.ref.id,
    ...document.data,
  }
}

const addUser = async (user) => {
  const data = {
    id: user.user_id,
    username: user.user_name,
    teamId: user.team_id,
  }
  const document = await client.query(
    q.Create(q.Collection('users'), { data })
  )

  return {
    id: document.ref.id,
    ...document.data,
  }
}

const getTeams = async () => {
  const { data: documents } = await client.query(
    q.Map(q.Paginate(q.Match(q.Index('all_teams'))), (ref) => q.Get(ref))
  )

  return documents.map(({ ref, data }) => ({
    id: ref.id,
    ...data,
  }))
}

const getTeamMembers = async (id) => {
  const { data: documents } = await client.query(
    q.Map(q.Paginate(q.Match(q.Index('team_members'), id)), (ref) => q.Get(ref))
  )

  return documents.map(({ ref, data }) => ({
    id: ref.id,
    ...data,
  }))
}

module.exports = {
  addTeam,
  addUser,
  getTeams,
  getTeamMembers
}