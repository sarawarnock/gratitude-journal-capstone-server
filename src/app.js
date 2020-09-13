require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const entriesRouter = require('./entries/entries-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

app.use(morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
}))
//app.use(cors())
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
)
app.use(helmet())

app.use(express.static('public'))

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/entries', entriesRouter)
app.use(errorHandler)

module.exports = app
