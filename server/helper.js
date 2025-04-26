const mysql = require("mysql");

require("dotenv").config();

// DB login info
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

function connectToDatabase() {
    let connection = mysql.createConnection({
        host: "localhost",
        user: USERNAME,
        password: PASSWORD
    });

    connection.connect((err) => {
        if (err)
            throw err;

        console.log("Connected");
    })

    return connection;
}

function closeConnection(connection) {
    if (connection) {
        connection.end((err) => {
            if (err)
                throw err;

            console.log("Disconnected");
        });
    }
}

module.exports = {
    connectToDatabase,
    closeConnection
};
