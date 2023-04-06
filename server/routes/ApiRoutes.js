const express = require('express')
const router = express.Router()

const { Tag } = require('../models/TagModel')
const { Dog } = require('../models/DogModel')

const { mongoChecker, isMongoError } = require("./helpers/mongo");

function errorChecker (res, error) {
    console.log(error)

    if (isMongoError(error)) {
        res.status(500).send('Internal server error')
    } else {
        res.status(400).send('Bad Request')
    }
}

async function tagRouteHandler (req, res) {
    const uuid = req.params.uuid

    try {
        const tag = await Tag.findOne({uuid: uuid})

        if (!tag) {
            res.status(404).send('Tag not found')
        } else {
            res.redirect(307, `/api/dog/${tag.id}`)
        }
    } catch (error) {

    }
}

router.route('/tag/:uuid')
    .get(mongoChecker, tagRouteHandler)
    .post(mongoChecker, tagRouteHandler)


async function dogRouteMiddleware (req, res, next) {
    const id = req.params.id

    try {
        const dog = await Dog.findOne({id: id})

        if (!dog) {
            res.status(404).send('Dog not found')
        } else {
            req.dog = dog
            next()
        }
    } catch (error) {
        errorChecker(res, error)
    }
}

router.get('/dog/:id', mongoChecker, dogRouteMiddleware, (req, res) => {
    res.send(req.dog)
})

router.post('/dog/:id', mongoChecker, dogRouteMiddleware, (req, res) => {
    req.dog.status = !req.dog.status
    req.dog
        .save()
        .then(dog => res.send(dog))
        .catch(error => errorChecker(res, error))
})

module.exports = router
