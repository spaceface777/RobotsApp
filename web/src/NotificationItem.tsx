import JSX from "jsxlite"
import { icon, library } from "@fortawesome/fontawesome-svg-core"
import { faExclamationCircle, faXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons"

import 'css/notif.css'
import { MapFrame, replaceContent } from "navigation"

library.add(faExclamationCircle, faXmark, faLocationDot)
const notifIcon = icon({ prefix: 'fas', iconName: 'exclamation-circle' })
const closeIcon = icon({ prefix: 'fas', iconName: 'xmark' })
const mapIcon = icon({ prefix: 'fas', iconName: 'location-dot' })

export type NotificationItemProps = {
    title: string,
    body: string,
    image: string,
    detectionTime: Date
    detectionLocation: [number, number]
}

export const NotificationItem = ({ title, body, image, detectionTime, detectionLocation }: NotificationItemProps) => {
    const onclick = () => {
        console.log("Notification clicked")

        let expanded: HTMLElement


        history.pushState(null, '', location.pathname + location.search);
        const l = (e: PopStateEvent) => {
            e.preventDefault();
            e.stopPropagation();
            removeExpanded();
        }
        window.addEventListener('popstate', l)

        const removeExpanded = () => {
            expanded.style.opacity = '0'
            setTimeout(()=> {
                document.body.removeChild(expanded)
                window.removeEventListener('popstate', l)
            }, 500)
        }

        const location_clicked = () => {
            console.log('Location clicked')
            removeExpanded()
            replaceContent(<MapFrame />)

            const marker = document.querySelector(`.marker.unhealthy[data-x="${detectionLocation[0]}"][data-y="${detectionLocation[1]}"]`) as HTMLDivElement
            if (!marker) return

            marker.classList.add('pulse')
            setTimeout(() => marker.classList.remove('pulse'), 10000)
        }

        expanded = (
            <div class="notif-expanded-container" onclick={removeExpanded}>
                {/* <button class="notif-expanded-close-btn" innerHTML={closeIcon.html[0]} /> */}
                <div class="notif-expanded" onclick={e => e.stopPropagation() }>
                    <div class="notif-expanded-header">
                        <div class="notif-icon" innerHTML={notifIcon.html[0]} />
                        <h3 class="notif-title">{title}</h3>
                    </div>
                    <p class="notif-expanded-body">{body}</p>
                    <p class="notif-expanded-time">{detectionTime.toLocaleString()}</p>
                    <button class="notif-expanded-location-container" onclick={location_clicked}>
                        <div class="notif-expanded-location-icon" innerHTML={mapIcon.html[0]}></div>
                        {/* <p class="notif-expanded-location">{`( ${detectionLocation[0]}, ${detectionLocation[1]})`}</p> */}
                        <p class="notif-expanded-location">{`Open map`}</p>
                        </button>
                </div>
            </div>
        )

        document.body.appendChild(expanded)
        requestAnimationFrame(() => expanded.style.opacity = '1')
    }

    return (
        <div class="notif" onclick={onclick}>
            <img class="notif-image" src={image} />
            <div class="notif-content">
                <div class="notif-header">
                    <div class="notif-icon" innerHTML={notifIcon.html[0]} />
                    <h3 class="notif-title">Disease detected</h3>
                </div>

                <p class="notif-expand-text">Click for more information</p>
            </div>
        </div>
    )
}
