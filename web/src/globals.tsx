import { NotificationItemProps } from "NotificationItem"
import { DetectionData } from "utils"
import { connectWs } from "ws"

export const STATE = {
    notifications: [] as NotificationItemProps[],
    detections: [] as DetectionData[],
    PAUSED: false,

    ws: connectWs()
}

export default STATE
