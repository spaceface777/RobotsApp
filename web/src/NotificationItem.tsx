import JSX from "jsxlite"
import { icon, library } from "@fortawesome/fontawesome-svg-core"
import { faExclamationCircle, faXmark } from "@fortawesome/free-solid-svg-icons"

import 'css/notif.css'

library.add(faExclamationCircle, faXmark)
const notifIcon = icon({ prefix: 'fas', iconName: 'exclamation-circle' })
const closeIcon = icon({ prefix: 'fas', iconName: 'xmark' })

console.log(closeIcon.html)

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

        expanded = (
            <div class="notif-expanded-container" onclick={removeExpanded}>
                <button class="notif-expanded-close-btn" innerHTML={closeIcon.html[0]} />
                <div class="notif-expanded" onclick={e => e.stopPropagation() }>
                    <div class="notif-expanded-header">
                        <div class="notif-icon" innerHTML={notifIcon.html[0]} />
                        <h3 class="notif-title">{title}</h3>
                    </div>
                    <p class="notif-expanded-body">{body}</p>
                    <p class="notif-expanded-time">{detectionTime.toLocaleString()}</p>
                    <p class="notif-expanded-location">{detectionLocation[0] + ''}, {detectionLocation[1] + ''}</p>
                </div>
            </div>
        )

        document.body.appendChild(expanded)
        requestAnimationFrame(() => expanded.style.opacity = '1')
    }

    return (
        <div class="notif" onclick={onclick}>
            <div class="notif-header">
                <div class="notif-icon" innerHTML={notifIcon.html[0]} />
                <h3 class="notif-title">Disease detected</h3>
            </div>

            <img class="notif-image" src={image} />

            <p class="notif-expand-text">Click for more information</p>
        </div>
    )
}
