import { css } from "@emotion/react"
import i18next, { TFunction } from "i18next"
import { useEffect, useState } from "react"

interface TimeCountdownProps {
    to: Date | number
}

interface Display {
    h: string
    m: string
    s: string
}

function getDisplay(timeMS: number): Display {
    const diff = Math.max(0, Math.floor((timeMS - Date.now()) / 1000))
    let hours = Math.floor(diff / 3600)
    let minutes = Math.floor((diff - hours * 3600) / 60)
    let seconds = Math.floor((diff - hours * 3600 - minutes * 60))
    
    return {
        h: (hours < 10 ? "0" : "") + hours,
        m: (minutes < 10 ? "0" : "") + minutes,
        s: (seconds < 10 ? "0" : "") + seconds,
    }
}

const _css = css`
    color: var(--t-neutral-4);
    & > span {
        color: var(--t-color);
    }
`

export default function TimeCountdown({to}: TimeCountdownProps) {
    const [display, setDisplay] = useState<Display>(() => getDisplay(+to))

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplay(getDisplay(+to))
        }, 1000)
        return () => clearInterval(interval)
    }, [to])

    return <span css={_css}>
        <span>{display.h}</span>
        :
        <span>{display.m}</span>
        :
        <span>{display.s}</span>
    </span>
}