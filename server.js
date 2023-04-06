const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");

const MURL = process.env.MONGO_URL

// Route Files
const initRoutes = require("./routes/main");
const publicKey = process.env.PUBLIC_URL;

mongoose
  .connect(MURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected".green.bold))
  .catch((err) => console.log(err));

const app = express();

const corsOptions = {
  origin: publicKey,
};

initRoutes(app);

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));




// Routing for API Service

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
