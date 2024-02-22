const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");

const user = require("./routes/user");

const customENV = require("custom-env");

customENV.env(process.env.NODE_ENV, "./config");
