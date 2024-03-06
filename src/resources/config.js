'use client'

import {extendTheme} from "@mui/joy";
import axios from "axios";

export const config = {
    spaces: process.env.NEXT_PUBLIC_SPACES,
    server: process.env.NEXT_PUBLIC_SERVER
}

export const postman = axios.create({
    baseURL: config.server,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

postman.interceptors.request.use((config) => {
    if (!config.headers.has('Authorization')) config.headers.set('Authorization', `BearerJWT ${sessionStorage.getItem('token')}`)
    return config
})

postman.interceptors.response.use((response) => {
    if (response.headers.has('X-Token-Renewal')) sessionStorage.setItem('token', response.headers.get('X-Token-Renewal'))
    return response
}, (error) => {
    if (error.response?.status === 401) {
        sessionStorage.setItem('signedOut', 'true')
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export const theme = extendTheme({
    "colorSchemes": {
        "light": {
            "palette": {
                "primary": {
                    "50": "#E9ECED",
                    "100": "#D9C7C5",
                    "200": "#CAA29D",
                    "300": "#BA7C74",
                    "400": "#AA574C",
                    "500": "#924E45",
                    "600": "#7B453D",
                    "700": "#633B36",
                    "800": "#4C322E",
                    "900": "#342927",
                    "solidDisabledBg": "var(--joy-palette-neutral-200)"
                },
                "neutral": {
                    "50": "#EFEDEC",
                    "100": "#DDD8D5",
                    "200": "#CCC4BF",
                    "300": "#BAAFA8",
                    "400": "#A89A91",
                    "500": "#94867D",
                    "600": "#807269",
                    "700": "#6D5E54",
                    "800": "#594A40",
                    "900": "#45362C",
                    "solidDisabledBg": "var(--joy-palette-neutral-200)"
                },
                "success": {
                    "50": "#E3FBE3",
                    "100": "#C4E5C4",
                    "200": "#A6CFA6",
                    "300": "#87B987",
                    "400": "#68A368",
                    "solidDisabledBg": "var(--joy-palette-neutral-200)"
                },
                "danger": {
                    "solidDisabledBg": "var(--joy-palette-neutral-200)"
                },
                "warning": {
                    "50": "#fefce8",
                    "100": "#fef9c3",
                    "200": "#fef08a",
                    "300": "#fde047",
                    "400": "#facc15",
                    "500": "#eab308",
                    "600": "#ca8a04",
                    "700": "#a16207",
                    "800": "#854d0e",
                    "900": "#713f12",
                    "solidDisabledBg": "var(--joy-palette-neutral-200)"
                }
            }
        },
        "dark": {
            "palette": {
                "primary": {
                    "50": "#E9ECED",
                    "100": "#D9C7C5",
                    "200": "#CAA29D",
                    "300": "#BA7C74",
                    "400": "#AA574C",
                    "500": "#924E45",
                    "600": "#7B453D",
                    "700": "#633B36",
                    "800": "#4C322E",
                    "900": "#342927",
                },
                "success": {
                    "50": "#E3FBE3",
                    "100": "#C4E5C4",
                    "200": "#A6CFA6",
                    "300": "#87B987",
                    "400": "#68A368",
                }
            }
        }
    }
})
