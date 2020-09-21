module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://lhvnfmdlhcdlai:9acb90384af8e3a500bb598b070a4f2b9f35ebb5e0acc19817836c4911069501@ec2-54-146-4-66.compute-1.amazonaws.com:5432/d1ipun6qkj2jv9',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/gratitude-journal-capstone-test',
    JWT_SECRET: process.env.JWT_SECRET || 'abc234',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
    CLIENT_ORIGIN: 'https://gratitude-journal-capstone-client.vercel.app' || 'https://gratitude-journal-capstone-client-1z0yrv3jt.vercel.app' || 'https://gratitude-journal-capstone-client.sarawarnock.vercel.app'
}
