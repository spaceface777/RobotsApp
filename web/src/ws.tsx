import STATE from "globals"
import { generateMap, updateState, addDetection, addDetectionView } from "utils"

export const connectWs = () => {
    const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://'
    const ws = new WebSocket(protocol + location.host)
    ws.onopen = () => console.log('Connected to WebSocket')

    ws.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data)
        if (!data) return

        // console.log(`Received ${type} message:`, data)

        switch (type) {
            case 'map':
                STATE.detections = []
                STATE.notifications = []
                generateMap(data)
                break
            case 'state':
                updateState(data)
                break
            case 'detection':
                STATE.detections.push(data)
                addDetection(data)
                addDetectionView(data)
                break
        }
    }

    ws.onclose = () => {
        console.log('Disconnected from WebSocket')
        setTimeout(connectWs, 1000)
    }

    return ws
}
