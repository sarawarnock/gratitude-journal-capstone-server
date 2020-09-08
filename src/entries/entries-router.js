const path = require('path')
const express = require('express')
const xss = require('xss')
const EntriesService = require('./entries-service')

const entriesRouter = express.Router()
const jsonParser = express.json()

const serializeEntry = entry => ({
    id: entry.id,
    title: xss(entry.title),
    bullet_1: entry.bullet_1,
    bullet_2: entry.bullet_2,
    bullet_3: entry.bullet_3,
    mood: entry.mood,
    is_public: entry.is_public
})

entriesRouter
    .route('/')
    //relevant
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        EntriesService.getEntries(knexInstance)
            .then(entries => {
                res.json(entries.map(serializeEntry))
            })
            .catch(next)
    })
    //relevant
    .post(jsonParser, (req, res, next) => {
        const {
            title,
            user_id,
            bullet_1,
            bullet_2,
            bullet_3,
            mood,
            is_public
        } = req.body
        const newEntry = {
            title,
            user_id,
            bullet_1,
            bullet_2,
            bullet_3,
            mood,
            is_public
        }

        for (const [key, value] of Object.entries(newEntry))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })

        //newEntry.completed = completed;

        EntriesService.insertEntry(
                req.app.get('db'),
                newEntry
            )
            .then(entry => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${entry.id}`))
                    .json(serializeEntry(entry))
            })
            .catch(next)
    })

entriesRouter
    .route('/:entries_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.entries_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }
        EntriesService.getEntryById(
                req.app.get('db'),
                req.params.entries_id
            )
            .then(entry => {
                if (!entry) {
                    return res.status(404).json({
                        error: {
                            message: `Entry doesn't exist`
                        }
                    })
                }
                res.entry = entry
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeEntry(res.entry))
    })
    //relevant
    .patch(jsonParser, (req, res, next) => {
        const {
            title,
            user_id,
            bullet_1,
            bullet_2,
            bullet_3,
            mood,
            is_public
        } = req.body
        const entryToUpdate = {
            title,
            user_id,
            bullet_1,
            bullet_2,
            bullet_3,
            mood,
            is_public
        }

        const numberOfValues = Object.values(entryToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        EntriesService.updateEntry(
                req.app.get('db'),
                req.params.entries_id,
                entryToUpdate
            )
            .then(updatedEntry => {
                res.status(200).json(serializeEntry(updatedEntry[0]))
            })
            .catch(next)
    })
    //relevant
    .delete((req, res, next) => {
        EntriesService.deleteEntry(
                req.app.get('db'),
                req.params.entries_id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

entriesRouter
    .route('/user/:user_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.user_id))) {
            return res.status(404).json({
                error: { message: `Invalid id` }
            })
        }
        EntriesService.getEntryByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(entry => {
                if (!entry) {
                    return res.status(404).json({
                        error: { message: `Entry doesn't exist` }
                    })
                }
                res.entry = entry
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.entry)
    })


module.exports = entriesRouter