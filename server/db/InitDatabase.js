const { Tag } = require('../models/TagModel')
const { Dog } = require('../models/DogModel')

const clearDB = async () => {
    await Tag.deleteMany({})
    await Dog.deleteMany({})
}

const initTagDB = async () => {
    const hardcoded_tags = [
        {
            uuid: 'CC990039',
            id: 1
        },
        {
            uuid: '33F43817',
            id: 2
        }
    ]

    hardcoded_tags.map(async (tag) => {
        const defaultTag = new Tag({
            uuid: tag.uuid,
            id: tag.id
        })
        await defaultTag.save()
    })
}

const initDogDB = async () => {
    const hardcoded_dogs = [
        {
            id: 1,
            name: 'Dog 1',
            status: true
        },
        {
            id: 2,
            name: 'Dog 2',
            status: false
        }
    ]

    hardcoded_dogs.map(async (dog) => {
        const defaultDog = new Dog({
            id: dog.id,
            name: dog.name,
            status: dog.status
        })
        await defaultDog.save()
    })
}

const initDB = async () => {
    await clearDB()
    await initTagDB()
    await initDogDB()
}

module.exports = { initDB }
