// const shuffle = require("lodash/shuffle");

// const users = [...]

// const getRandomUser = (list) => {
//   if (list.length > 0) {
//     return list[Math.floor(Math.random() * Math.floor(list.length))];
//   } else {
//     return null;
//   }
// };

// const team = users.map(({ id, matched }) => ({
//   id,
//   matched,
// }));

// const getMatches = (list) => shuffle(list).map((user) => ({
//   ...user,
//   matched: user.matched.reduce((acc, curr) => acc[curr.guest.id]
//     ? { ...acc, [curr.guest.id]: acc[curr.guest.id] + 1 }
//     : { ...acc, [curr.guest.id]: 1 }
//   , {}),
// })).map((user) => {
//   const allUsers = users.map((u) => u.id);
//   const unmatched = allUsers.reduce((acc, curr) => curr !== user.id && !user.matched[curr]
//       ? { ...acc, [curr]: 0 }
//       : acc
//   , {});
//   return {
//     ...user,
//     matched: { ...user.matched, ...unmatched },
//   };
// }).map((user) => {
//   const lowestOccurance = Object.keys(user.matched).reduce(
//     (lowest, current) => user.matched[current] < lowest
//         ? user.matched[current]
//         : lowest
//     , 500 // replace this with non-magic number
//   );
//   const availableUsers = Object.keys(user.matched).filter(
//     (m) => user.matched[m] === lowestOccurance
//   );
//   return {
//     ...user,
//     match: getRandomUser(availableUsers),
//   };
// })

// TODO:
// fix up returned data structure
// test with empty list
// test with uneven list
// replace old version carefully

// for (let i = 0; i < 100; i++) {
// console.log(getMatches(team));
// }

// module.exports = async (req, res) => {
// try {
// const { secret } = req.body
// if (secret === process.env.MATCH_SECRET) {
// const matches = await getAllMatches();
// res.send(matches);
// }
// else {
// res.send('failed to send coffee dates')
// }
// } catch (e) {
// console.log(e);
// res.send("failed to send coffee dates");
// }
// };

const { sendMatchMessages } = require("../_utils/matcher");

module.exports = async (req, res) => {
  try {
    sendMatchMessages().then((resp) => res.send(resp));
  } catch (e) {
    console.log(e);
    res.send("failed to send coffee dates");
  }
};
