'use client'

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Rubik_Dirt} from "next/font/google";

const rubik_dirt = Rubik_Dirt({ weight: '400', subsets: ['latin'] })

export default function Footer() {
    return (
        <footer style={{display: 'flex', textAlign: 'center', alignItems: 'center'}}>
            <Typography className={rubik_dirt.className} sx={{mx: 'auto'}}>&#169; 2024 Building Restoration Experts Crafting Keystone Solutions.</Typography>
        </footer>
    )
}
