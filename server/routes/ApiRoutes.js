const express = require('express')
const router = express.Router()

const { Dog } = require('../models/DogModel')

const { mongoChecker, isMongoError } = require("./helpers/mongo");

router.get('/:id', mongoChecker, async (req, res) => {
    const id = req.params.id

    try {
        const dog = await Dog.findOne({id: id})

        if (!dog) {
            res.status(404).send('Dog not found')
        } else {
            res.send(dog)
        }
    } catch (error) {
        console.log(error)

        if (isMongoError(error)) {
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request')
        }
    }
})

router.post('/:id', mongoChecker, async (req, res) => {
    const id = req.params.id

    try {
        const dog = await Dog.findOne({id: id})

        if (!dog) {
            res.status(404).send('Dog not found')
        } else {
            dog.status = !dog.status
            const result = await dog.save()
            res.send(result)
        }
    } catch (error) {
        console.log(error)

        if (isMongoError(error)) {
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request')
        }
    }
})

module.exports = router
