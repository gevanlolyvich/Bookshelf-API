const hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async() => {
    const server = hapi.server({
        port: 9000,
        host: "localhost",
    });

    server.route(routes);

    await server.start();
    console.info(`Server berjalan di ${server.info.uri}`);
};
init();