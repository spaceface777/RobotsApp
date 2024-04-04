import JSX from "jsxlite"

import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faExclamationCircle, faLocationDot, faGear } from '@fortawesome/free-solid-svg-icons'

import { NotificationItem } from "NotificationItem"
import { $, createDetection, map } from "utils"
import STATE from "globals"

import 'css/index.css'

library.add(faChevronLeft, faExclamationCircle, faLocationDot, faGear)

const backIcon = icon({ prefix: 'fas', iconName: 'chevron-left' })
const notifIcon = icon({ prefix: 'fas', iconName: 'exclamation-circle' })
const mapIcon = icon({ prefix: 'fas', iconName: 'location-dot' })
const settingsIcon = icon({ prefix: 'fas', iconName: 'gear' })

export const replaceContent = (newContent: HTMLElement) => {
    const content = $('#content')!;

    const currentPage = $('#map') ? 'map' :
        $('#notifications') ? 'notifications' :
            $('#settings') ? 'settings' : '';

    content.innerHTML = '';
    content.appendChild(newContent);

    history.pushState({ typ: 'pageChange', prev: currentPage }, '', location.pathname + location.search);
};

export const Footer = () => (
    <div id="footer">
        {/* <button id="back-btn"     onclick={ undefined } innerHTML={backIcon.html[0]}></button> */}
        <button id="map-btn"      onclick={ () => replaceContent(<MapFrame/>) } innerHTML={mapIcon.html[0]}></button>
        <button id="notif-btn"    onclick={ () => replaceContent(<NotificationsFrame/>) } innerHTML={notifIcon.html[0]}></button>
        <button id="settings-btn" onclick={ () => replaceContent(<SettingsFrame/>) } innerHTML={settingsIcon.html[0]}></button>
    </div>
)

export const Frame = (title: string, content: JSX.Element, back: boolean = true) => (
    <div id="frame">
        <div id="title">
            {back ? <button id="back-btn" onclick={ () => history.back() } innerHTML={backIcon.html[0]}></button> : ''}
            {title}
        </div>
        {content}
    </div>
)

export const NotificationsFrame = () => Frame("Notifications", (
    <div id="notifications">
        { STATE.notifications.map(props => <NotificationItem {...props} />) }
    </div>
))

export const MapFrame = () => Frame("Home", (
    <div id="map">
        <img id="map-img" src={map} />
        <div class="marker" id="robot"></div>
        { STATE.detections.map(createDetection) }

        <div class="home-content">
            <p id="robot-battery">Robot battery: 100%</p>
            <button class="mainScreen-btn" onclick={() => STATE.PAUSED = false}>Start cutting</button>
            <button class="mainScreen-btn" onclick={() => STATE.PAUSED = true}>Dock</button>
            <button class="mainScreen-btn" onclick={() => null}>Ring</button>
        </div>
    </div>
), false)

const SaveDay = (day: string) => (e: MouseEvent) => {
    const newVal = localStorage.getItem(day) === 'false'
    localStorage.setItem(day, newVal.toString())
    const btn = e.target as HTMLButtonElement
    btn.classList.toggle('active')
}

export const SettingsFrame = () => Frame("Settings", (
    <div id="settings">
        {/* <h1>Settings</h1> */}
        <h3>Schedule</h3>
        <div class="setting">
            <label for="start">Start time: </label>
            <input type="time" id="start" name="start" class="mainScreen-btn" onChange={console.log} />
        </div>
        <div class="setting">
            <label for="duration">Duration: </label>
            <input type="number" id="duration" name="duration" class="mainScreen-btn" onChange={console.log} />
            hours
        </div>
        <div class="setting">
            <label >Days: </label>
            <button class="day mainScreen-btn active" onclick={SaveDay('Mon')}>M</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Tue')}>T</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Wed')}>W</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Thu')}>T</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Fri')}>F</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Sat')}>S</button>
            <button class="day mainScreen-btn active" onclick={SaveDay('Sun')}>S</button>
        </div>

    </div>
))

export const App = () => (
    <div id="app">
        <div id="content">
            <MapFrame />
        </div>
        <Footer />
    </div>
)
