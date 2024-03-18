import JSX from "jsxlite"

import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faCaretLeft, faExclamationCircle, faLocationDot, faGear } from '@fortawesome/free-solid-svg-icons'

import { NotificationItem } from "NotificationItem"

import 'css/index.css'

import map from 'img/map.png'
import sick1 from 'img/sick1.jpg'

library.add(faCaretLeft, faExclamationCircle, faLocationDot, faGear)

const backIcon = icon({ prefix: 'fas', iconName: 'caret-left' })
const notifIcon = icon({ prefix: 'fas', iconName: 'exclamation-circle' })
const mapIcon = icon({ prefix: 'fas', iconName: 'location-dot' })
const settingsIcon = icon({ prefix: 'fas', iconName: 'gear' })

const Footer = () => (
    <div id="footer">
        <button id="back-btn"     onclick={ undefined } innerHTML={backIcon.html[0]}></button>
        <button id="notif-btn"    onclick={ replaceContent(<NotificationsFrame/>) } innerHTML={notifIcon.html[0]}></button>
        <button id="map-btn"      onclick={ replaceContent(<MapFrame/>) } innerHTML={mapIcon.html[0]}></button>
        <button id="settings-btn" onclick={ replaceContent(<SettingsFrame/>) } innerHTML={settingsIcon.html[0]}></button>
    </div>
)

const replaceContent = (newContent: HTMLElement) => () => {
    const content = document.getElementById('content')!
    content.innerHTML = ''
    content.appendChild(newContent)
}

const Frame = (title: string, content: JSX.Element) => (
    <div id="frame">
        <div id="title">{title}</div>
        {content}
    </div>
)

const NotificationsFrame = () => Frame("Notifications", (
    <div id="notifications">
        <NotificationItem
            title="Notification Title"
            body="Notification Body"
            image={sick1}
            detectionTime={new Date('2024-03-15 13:31:20')}
            detectionLocation={[0, 0]}
        />
    </div>
))

const MapFrame = () => Frame("Map", (
    <div id="map">
        <img src={map} />
    </div>
))

const SettingsFrame = () => Frame("Settings", (
    <div id="settings">
        <h1>Settings</h1>
    </div>
))

const App = () => (
    <div id="app">
        <div id="content">
            <NotificationsFrame />
        </div>
        <Footer />
    </div>
)


if (!document.getElementById('app')) {
    document.body.appendChild(<App/>)
}

