require('dotenv').config();

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "host": process.env.LIVE_MIGRATION_DB_HOST,
    "port": process.env.LIVE_MIGRATION_DB_PORT,
    "database": process.env.LIVE_MIGRATION_DB_NAME,
    "username": process.env.LIVE_MIGRATION_DB_USER,
    "password": process.env.LIVE_MIGRATION_DB_PASS
}
