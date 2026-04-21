module.exports = {
  name: "clientReady",
  once: true,

  execute(client) {

    let i = 0;

    setInterval(() => {

      // ✅ fallback if empty
      if (!client.statusList || client.statusList.length === 0) {
        client.user.setPresence({
          activities: [{
            name: "Eight Streets RolePlay", // ✅ default
            type: 0
          }],
          status: "online"
        });
        return;
      }

      const s = client.statusList[i % client.statusList.length];

      // ✅ SAFE CHECK
      if (!s || typeof s.text !== "string") return;

      client.user.setPresence({
        activities: [{
          name: s.text,
          type: s.type || 0
        }],
        status: "online"
      });

      i++;

    }, 10000);
  }
};