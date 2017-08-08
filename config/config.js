var db = {
    development: {
        mysql: {
            connectionLimit : 10,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'purastays',
            port: 3306,
        },

        mongodb: {

        }
    },
    production: {
        mysql: {
            connectionLimit : 10,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'purastays',
            port: 3306,
        },

        mongodb: {

        }
    },
};

module.exports = db;