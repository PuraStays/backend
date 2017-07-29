var db = {
    development: {
        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'purastays'
        },

        mongodb: {

        }
    },
    production: {
        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'purastays'
        },

        mongodb: {

        }
    },
};

module.exports = db;