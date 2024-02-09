'use client'

import {Sheet, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function JobData({sx, job}) {
    const dateFormatter = (dateStr) => new Date(dateStr)
        .toLocaleString("en-US", {timeZone: "UTC", month: '2-digit', day: '2-digit', year: 'numeric'})
        .toString()

    const dataRow = (key, value) => {
        return <Stack direction='row' spacing={2}>
            <Typography className={RedHatFont.className} fontWeight='800' sx={{color: 'var(--joy-palette-neutral-900)'}}>{key}:</Typography>
            <Typography className={RedHatFont.className} fontWeight='600' sx={{color: 'var(--joy-palette-neutral-900)'}}>{value}</Typography>
        </Stack>
    }

    return <Sheet variant='soft' sx={{...sx, p: 1, borderRadius: '15px'}}>
        <Stack spacing={2}>
            {dataRow('Project Manager', job.team?.projectManager?.fullName)}
            {dataRow('Start date', dateFormatter(job.startDate))}
            {dataRow('Last active', dateFormatter(job.endDate))}
        </Stack>
    </Sheet>
}
