'use client'

import {IconButton, Tooltip} from "@mui/joy";
import {Red_Hat_Display} from "next/font/google";
import {useState} from "react";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '500']})

export default function Tool({name, icon, onClick, sx = {}, disabled = false, props = {}, children}) {
    const [showTooltip, setShowTooltip] = useState(false)

    const child = children ? children : <IconButton disabled={disabled} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={() => {setShowTooltip(false); onClick()}} className={'tool'} sx={{background: 'black', '&:hover': {background: 'rgba(0,0,0,0.80)', color: '#FFFFFFF0'}, ...sx}} {...props}>
        {icon}
    </IconButton>

    return <Tooltip open={showTooltip} sx={{background: 'black', color: 'white'}} className={RedHatFont.className} title={name}>
        {child}
    </Tooltip>
}
