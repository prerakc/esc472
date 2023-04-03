"use strict";

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")

const bodyParser = require('body-parser')

const { mongoose } = require("./db/mongoose")
const { initDB } = require("./db/InitDatabase")

const { Tag } = require('./models/TagModel')
const { Dog } = require('./models/DogModel')

initDB().then(() => {
    const port = new SerialPort({ path: 'COM7', baudRate: 9600 })
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

    const app = express()
    const httpServer = createServer(app)
    const io = new Server(httpServer)

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/api', require('./routes/ApiRoutes'))

    io.on("connection", (socket) => {
        console.log('socket opened')

        socket.on('disconnect', () => {
            console.log('socket closed')
        })
    })

    parser.on('data', async (data) => {
        try {
            const tag = await Tag.findOne({uuid: data})

            if (!tag) {
                console.log('Invalid tag uuid')
            } else {
                const dog = await Dog.findOne({id: tag.id})

                if (!dog) {
                    console.log('Invalid dog id')
                } else {
                    io.emit('data', dog)
                }
            }
        } catch (error) {
            console.log(error)
        }
    })

    // port.on('data', function (data) {
    //     console.log('Data:', data)
    //     console.log('Converted Data:', data.toString())
    // })
    //
    // parser.on('data', (data) => {
    //     console.log('Parsed Data:', data)
    //     console.log('Buffered Data:', (Buffer.from(data)))
    // })

    const port2 = new SerialPort({ path: 'COM8', baudRate: 9600 })

    setInterval(function() {
        port2.write('1\r\n')
    }, 5000)

    httpServer.listen(3000, () => {
        console.log('listening on *:3000')
    });
})
