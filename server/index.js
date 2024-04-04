const path = require('path')

const ws = require('ws')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const httpServer = app.listen(13579)
const wsServer = new ws.Server({ noServer: true })

const basedir = path.join(__dirname, '..')

// app.use(express.static(path.join(basedir, 'web', 'dist')))
app.use(express.static(path.join(basedir, 'server', 'dist')))

app.use(bodyParser.json())

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

let map = null
let battery = 100
let pos = { x: 0, y: 0 }

let detections = []

const MapEvent = () => JSON.stringify({ type: 'map', data: map })
const StateEvent = () => JSON.stringify({ type: 'state', data: { battery, pos } })
const DetectionEvent = e => JSON.stringify({ type: 'detection', data: e })

app.post('/setMap', (req, res) => {
    ({ map } = req.body)
    res.send('Map set!')

    detections = []

    clients.forEach(c => c.send(MapEvent()))
})

app.post('/setState', (req, res) => {
    ({ battery, pos } = req.body)
    res.send('State set!')

    clients.forEach(c => c.send(StateEvent()))
})

app.post('/addDetections', (req, res) => {
    let { detections: newDetections } = req.body

    res.send('Detections added!')

    for (const e of newDetections) {
        // let { pos, isSick } = e
        detections.push(e)
        clients.forEach(c => c.send(DetectionEvent(e)))
    }
})


/**
 * @type {Set<ws>}
 */
const clients = new Set()


{
    // Periodically check if clients are still connected
    let lastN = 0
    setInterval(() => {
        clients.forEach(client => client.readyState !== ws.OPEN && clients.delete(client))
        if (lastN !== clients.size) {
            console.log(`Number of clients: ${clients.size}`)
            lastN = clients.size
        }
    }, 1000)
}

wsServer.on('connection', (ws, req) => {
    console.log('New connection')
    clients.add(ws)

    setTimeout(() => {
        ws.send(MapEvent())
        ws.send(StateEvent())
        detections.forEach(e => ws.send(DetectionEvent(e)))
    }, 1000)
    
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`)

        // // Broadcast message to all clients
        // clients.forEach(c => c.send(`Received message => ${message}`))
    })
})

httpServer.on('upgrade', (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req)
    })
})  

console.log('Server started on port 13579')
