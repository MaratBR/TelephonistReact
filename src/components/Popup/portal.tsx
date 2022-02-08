import React from "react"

const POPUP_ID = "popup-portal-root"

function getRoot() {
    let $root = document.getElementById(POPUP_ID)
    if (!$root) {
        $root = document.createElement("div")
        $root.id = POPUP_ID
        document.appendChild($root)
    }
    
    return $root
}

type CreatePopupFunction = () => React.ReactNode
type OnCloseCallback = () => void
interface PopupObject {
    render: CreatePopupFunction
    onClose?: OnCloseCallback
    closeable?: boolean
    clickOutside?: boolean
}
type Popup = CreatePopupFunction | PopupObject

type PopupFunction = (popup: Popup) => Promise<void>

const PopupContext = React.createContext<PopupFunction | null>(null)

export const PopupProvider = PopupContext.Provider