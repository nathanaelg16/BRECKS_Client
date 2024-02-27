'use client'

import {Stack} from "@mui/joy";

export default function Toolbar({sx, children}) {
    return <Stack id='toolbar' direction='row' justifyContent='flex-end' alignItems='center' spacing={1} sx={{pr: 1, py: 1, width: 1, ...sx}}>
        {children}
    </Stack>
}
