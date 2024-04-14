const net = require("net");

const checkListUrl = async (req, res) => {
  const ListURL = req.body.listurl;

  if (!ListURL || !Array.isArray(ListURL)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let isBadFound = false;
  const client = new net.Socket();

  client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, () => {
    console.log("Connected to TCP server");
    sendUrlsSequentially(ListURL);
  });

  const sendUrlsSequentially = async (urls) => {
    for (let i = 0; i < urls.length; i++) {
      await sendAndReceive(urls[i]);
    }
  };

  const sendAndReceive = (url) => {
    return new Promise((resolve) => {
      client.write(`${url}`);
      console.log("Sending " + url);

      client.once("data", (data) => {
        console.log(`Received data from TCP server: ${data}`);

        if (data.toString() === "true") {
          isBadFound = true;
        }

        resolve();
      });
    });
  };

  client.on("end", () => {
    console.log("Disconnected from TCP server");
    if (isBadFound) {
      res.status(403).json(false);
    } else {
      res.status(200).json(true);
    }
  });

  client.on("error", (err) => {
    console.error("Error connecting to TCP server:", err);
    res.status(500).json({ error: "Error connecting to TCP server" });
  });
};

module.exports = { checkListUrl };
