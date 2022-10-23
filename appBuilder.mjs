// console.log('#f AppBuilder');

import BaseApp from "./src/app/index.mjs";
import http from 'http';

/**
 * Create HTTP server.
 */

// console.log('#f AppBuilder here2');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    // console.log('normalizePort', val);
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    // console.log('onError');
    if (error.syscall !== 'listen') {
        throw error;
    }
    // console.error('error', error.port)
    var bind = typeof error.port === 'string'
        ? 'Pipe ' + error.port
        : 'Port ' + error.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

// console.log('#f AppBuilder here3');

export default function AppBuilder(config) {

    console.log('==> AppBuilder()');
    // console.log('process.env.SERVER_PORT', process.env.SERVER_PORT)
    // process.exit();
    var port = normalizePort(process.env.SERVER_PORT);
    // console.log('config', config.base)
    let app = BaseApp(config);

    const server = http.createServer(app);
    // if (config && config.server)
    //     config.server.forEach(serv => {
    //         serv(app);
    //     });
    app.set('port', port);

    function onListening() {
        // console.log('onListening');

        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }


    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

}


