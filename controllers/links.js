const net = require("net");

const checkListUrl = async (req, res) => {
  const input = req.body.content;

  const httpRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  const matches = input.match(httpRegex);

  const ListURL = matches ? matches : [];

  if (ListURL.length === 0) {
    return res.status(200).json({ isValid: true });
  }

  let isBadFound = false;
  const client = new net.Socket();

  client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, () => {
    console.log("Connected to TCP server");
    sendUrlsSequentially(ListURL);
  });

  const sendUrlsSequentially = async (urls) => {
    for (let i = 0; i < urls.length; i++) {
      await sendAndReceive("2 " + urls[i]);
    }
    await sendAndReceive("close");
  };

  const sendAndReceive = (url) => {
    return new Promise((resolve) => {
      client.write(`${url}`);
      console.log("Sending " + url);

      client.once("data", (data) => {
        console.log(`Received data from TCP server: ${data}`);
        if (data[0] == 102) {
          isBadFound = true;
        }

        resolve();
      });
    });
  };

  client.on("end", () => {
    console.log("Disconnected from TCP server");
    if (isBadFound) {
      return res.status(403).json({ isValid: false });
    } else {
      return res.status(200).json({ isValid: true });
    }
  });

  client.on("error", (err) => {
    console.error("Error connecting to TCP server:", err);
    res.status(500).json({ error: "Error connecting to TCP server" });
  });
};

module.exports = { checkListUrl };
