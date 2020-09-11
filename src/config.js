module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/gratitude-journal-capstone',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/gratitude-journal-capstone-test',
    JWT_SECRET: process.env.JWT_SECRET || 'abc234',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
