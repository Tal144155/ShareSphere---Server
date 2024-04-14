//checking list of links using the bloom filter
const checkListUrl = async (req, res) => {
  const ListURL = req.body.listurl;
  if (!ListURL || !Array.isArray(ListURL)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  ListURL.forEach((url) => {
    const isBad = callfunction(url);//edit here to work with the TCP server
    if (isBad) {
      return res.status(403).json(false);
    }
  });
    return res.status(200).json(true);
};

module.exports = { checkListUrl };

