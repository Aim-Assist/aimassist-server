const userRoute = require("./user")
const roundRoute = require("./round")

const initRoutes = (app) => {
    app.use("/api/v1/user", require("./user"));
    app.use("/api/v1/round", require("./round"));
};

module.exports = initRoutes;
