module.exports = {
  name: "clientReady",
  once: true,
  execute(client) {

    let i = 0;

    setInterval(() => {
      client.user.setPresence({
        activities: [{
          name: client.statusList[i % client.statusList.length],
          type: 0
        }],
        status: "online"
      });
      i++;
    }, 10000);
  }
};