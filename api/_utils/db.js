const faunadb = require('faunadb')
const { query: q } = faunadb

const client = new faunadb.Client({
  secret: process.env.FAUNA_DB,
})

const find = async (index, id) => {
  try {
    const document = await client.query(
      q.Get(q.Match(q.Index(index), id))
    )

    return {
      ref: document.ref.id,
      ...document.data,
    }
  } catch (error) {
    return null
  }
}

const update = async (collection, ref, data) => {
  const document = await client.query(
    q.Update(q.Ref(q.Collection(collection), ref), {
      data,
    })
  )

  return {
    ref: document.ref.id,
    ...document.data,
  }
}

const create = async (collection, data) => {
  const document = await client.query(
    q.Create(q.Collection(collection), { data })
  )

  return {
    ref: document.ref.id,
    ...document.data,
  }
}

const addUser = async (user) => {
  const data = {
    id: user.user_id,
    username: user.user_name,
    teamId: user.team_id,
  }

  const existingUser = await find('user', user.user_id)

  return existingUser
    ? update('users', existingUser.ref, data)
    : create('users', data)
}

const addTeam = async (team) => {
  const data = {
    id: team.team.id,
    name: team.team.name,
    token: team.access_token,
  }

  const existingTeam = await find('team', team.team.id)

  return existingTeam
    ? update('teams', existingTeam.ref, data)
    : create('teams', data)
}

const getTeams = async () => {
  const { data: documents } = await client.query(
    q.Map(q.Paginate(q.Match(q.Index('all_teams'))), (ref) => q.Get(ref))
  )

  return documents.map(({ ref, data }) => ({
    ref: ref.id,
    ...data,
  }))
}

const getTeamMembers = async (id) => {
  const { data: documents } = await client.query(
    q.Map(q.Paginate(q.Match(q.Index('team_members'), id)), (ref) => q.Get(ref))
  )

  return documents.map(({ ref, data }) => ({
    ref: ref.id,
    ...data,
  }))
}

const removeUser = async (user) => {
  const found = await find('user', user.user_id)
  if (found) {
    await client.query(
      q.Delete(q.Ref(q.Collection('users'), found.ref))
    )
  }
}

const getMatches = async (user) => {

}

module.exports = {
  addTeam,
  addUser,
  getTeams,
  getTeamMembers,
  removeUser,
  getMatches
}