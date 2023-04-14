const initRoutes = (app) => {
    app.use("/api/v1/user", require("./user"));
    app.use("/api/v1/round", require("./round"));
    app.use("/api/v1/session", require("./session"));
};

module.exports = initRoutes;
