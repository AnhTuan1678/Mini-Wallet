module.exports = {
  request: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 1, user, body });
  },

  confirm: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 2, user, body });
  },

  verify: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 3, user, body });
  },
};
