const userRoute = require("./user")
const roundRoute = require("./round")

const initRoutes = (app) => {
    app.use("/api/v1/user", userRoute);
    app.use("/api/v1/round", roundRoute);
};

module.exports = initRoutes;
