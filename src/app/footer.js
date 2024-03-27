'use client'

import Typography from "@mui/joy/Typography";
import {Rubik_Dirt} from "next/font/google";
import {useRef} from "react";
import Box from "@mui/joy/Box";

const rubik_dirt = Rubik_Dirt({ weight: '400', subsets: ['latin'] })

export default function Footer() {
    const currentYear = useRef(new Date().getFullYear())

    return (
        <Box component='footer' sx={{display: 'flex', textAlign: 'center', alignItems: 'center', flex: '0 1 40px', mt: {xs: 2, sm: 1}}}>
            <Typography className={rubik_dirt.className} sx={{mx: 'auto', fontSize: {xs: '14px', sm: 'unset'}}}>&#169; {currentYear.current} Building Restoration Experts Crafting Keystone Solutions.</Typography>
        </Box>
    )
}
