var db = {

    mysql: {
        connectionLimit : process.env.MYSQL_CONN_LIMIT,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        port: process.env.MYSQL_PORT,
    },

    mongodb: {

    }
};

module.exports = db;