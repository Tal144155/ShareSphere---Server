const net = require("net");

//checking list of links using the bloom filter
const checkListUrl = async (req, res) => {
  const ListURL = req.body.listurl;

  if (!ListURL || !Array.isArray(ListURL)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let isBadFound = false;
  let completedRequests = 0;
  const client = new net.Socket();

  client.connect(5555, "192.168.174.129", () => {
    console.log("Connected to TCP server");
  });

  ListURL.forEach((url) => {
    client.write(`check-url ${url}`);
  });

  client.on("data", (data) => {
    console.log(`Received data from TCP server: ${data}`);

    if (data.toString() === "true") {
      isBadFound = true;
    }

    completedRequests++;

    if (completedRequests === ListURL.length) {
      if (isBadFound) {
        res.status(403).json(false);
      } else {
        res.status(200).json(true);
      }
    }
  });

  client.on("end", () => {
    console.log("Disconnected from TCP server");
  });

  client.on("error", (err) => {
    console.error("Error connecting to TCP server:", err);
    res.status(500).json({ error: "Error connecting to TCP server" });
  });
};

module.exports = { checkListUrl };
