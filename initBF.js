//creating the custom env
const customENV = require("custom-env");

//connecting to env wanted
customENV.env(process.env.NODE_ENV, "./config");

const net = require("net");

async function addLinks() {
    // Parse the string into an array
    const links = process.env.URL_ARRAY.split(',');

    const client = new net.Socket();

    client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, () => {
        console.log("Connected to TCP server");
        sendUrlsSequentially(links);
      });
    
      const sendUrlsSequentially = async (urls) => {
        await sendAndReceive(process.env.BF_SETTINGS);
        for (let i = 0; i < urls.length; i++) {
          await sendAndReceive("1 " + urls[i]);
        }
        await sendAndReceive("close");
      };

      const sendAndReceive = (url) => {
        return new Promise((resolve) => {
          client.write(`${url}`);
          console.log("Sending " + url);
    
          client.once("data", (data) => {
            console.log(`Received data from TCP server: ${data}`);    
            resolve();
          });
        });
      };

      client.on("end", () => {
        console.log("Disconnected from TCP server");
      });
    
      client.on("error", (err) => {
        console.error("Error connecting to TCP server:", err);
      });
};

addLinks();