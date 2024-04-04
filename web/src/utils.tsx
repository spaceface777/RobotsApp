import JSX from "jsxlite"

import { NotificationItem } from "NotificationItem"
import STATE from "globals"
import { MapFrame, replaceContent } from "navigation"

import { diseases } from "diseases"

export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)

type Color = [number, number, number]
type MapData = Color[][]
export function generateMap(pixels: MapData) {
    const canvas = document.createElement('canvas')
    canvas.width = pixels.length
    canvas.height = pixels[0].length

    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const [r, g, b] = pixels[x][y]
            const i = (y + x * canvas.width) * 4
            imageData.data[i] = r
            imageData.data[i + 1] = g
            imageData.data[i + 2] = b
            imageData.data[i + 3] = 255
        }
    }

    ctx.putImageData(imageData, 0, 0)

    const png = canvas.toDataURL('image/png')
    map = png
    console.log('Generated map:', png)

    const curMap = $('#map')
    if (curMap) replaceContent(<MapFrame/>)

    return png
}

export let map: string = ''

export type RobotData = {
    battery: number
    pos: [number, number]
}
export function updateState(robotData: RobotData) {
    if (STATE.PAUSED) return
    const robot = $('#robot') as HTMLElement
    if (robot) {
        robot.style.display = 'block'
        robot.style.left = (robotData.pos[0] + 16) * 90/33 + 5  + 'vw'
        robot.style.top = (16 - robotData.pos[1])  * 90/33 + 22 + 'vw'
    }

    const battery = $('#robot-battery') as HTMLElement
    if (battery) battery.innerText = `Robot battery: ${robotData.battery}%`

}

export type DetectionData = {
    pos: [number, number]
    isSick: boolean
}
export function addDetection(detData: DetectionData) {
    const map = $('#map')
    if (!map) return

    const marker = createDetection(detData)
    map.appendChild(marker)
}

export function addDetectionView({ pos, isSick }: DetectionData) {
    if (!isSick) return

    const randDisease = diseases[Math.floor(Math.random() * diseases.length)]

    const newNotif = {
        title: "Detected " + randDisease.name,
        body: "Possible treatment: " + randDisease.treatment,
        image: randDisease.image,
        detectionTime: new Date(),
        detectionLocation: pos
    }
    STATE.notifications.push(newNotif)

    console.log('Added new notification:', newNotif)

    const notifContainer = $('#notifications')
    if (!notifContainer) return
    notifContainer.appendChild(<NotificationItem {...newNotif} />)
}

export function createDetection({ pos, isSick }: DetectionData) {
    console.log('Creating detection:', pos, isSick)

    const marker = <div
        class={`marker ${isSick ? 'unhealthy' : 'healthy'}`}
        data-x={''+pos[0]}
        data-y={''+pos[1]}
    />

    marker.style.left = (pos[0] + 16) * 90 / 33 + 5 + 'vw'
    marker.style.top = (16 - pos[1]) * 90 / 33 + 22 + 'vw'
    return marker
}
