const net = require("net");

//checking list of links using the bloom filter
const checkListUrl = async (req, res) => {
  const ListURL = req.body.listurl;

  if (!ListURL || !Array.isArray(ListURL)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let isBadFound = false;
  let completedRequests = 0;

  ListURL.forEach((url) => {
    const client = net.createConnection(
      { port: 5555, host: "localhost" },
      () => {
        console.log("Connected to TCP server");

        // Send URL to the TCP server
        client.write(`check-url ${url}`);
      }
    );

    client.on("data", (data) => {
      console.log(`Received data from TCP server: ${data}`);

      if (data.toString() === "true") {
        isBadFound = true;
      }

      client.end();
    });

    client.on("end", () => {
      console.log("Disconnected from TCP server");
      completedRequests++;

      if (completedRequests === ListURL.length) {
        if (isBadFound) {
          return res.status(403).json(false);
        }
        return res.status(200).json(true);
      }
    });

    client.on("error", (err) => {
      console.error("Error connecting to TCP server:", err);
      return res.status(500).json({ error: "Error connecting to TCP server" });
    });
  });
};

module.exports = { checkListUrl };
