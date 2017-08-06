var db = {
    development: {
        mysql: {
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