'use client'

import {Sheet} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";
import {useContext} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import Box from "@mui/joy/Box";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function JobData({sx}) {
    let [job, _] = useContext(JobContext)

    const dateFormatter = (dateStr) => new Date(dateStr)
        .toLocaleString("en-US", {timeZone: "UTC", month: '2-digit', day: '2-digit', year: 'numeric'})
        .toString()

    const dataRow = (key, value, pos) => {
        return <Box sx={{display: 'grid', gridTemplateColumns: 'subgrid', gridRow: pos, gridColumnStart: 'span 2'}}>
            <Typography className={RedHatFont.className} fontWeight='800' sx={{color: 'var(--joy-palette-neutral-900)', gridColumn: 1}}>{key}:</Typography>
            <Typography className={RedHatFont.className} fontWeight='600' sx={{color: 'var(--joy-palette-neutral-900)', gridColumn: 2}}>{value}</Typography>
        </Box>
    }

    return <Sheet variant='soft' sx={{...sx, p: 1, borderRadius: '15px', pr: {lg: 0, xs: 2}}}>
        <Box sx={{display: 'grid', gridTemplateColumns: '35% 65%', width: 1, height: {lg: 1, xs: 'unset'}, columnGap: 2, rowGap: 2}}>
            {dataRow('Project Manager', job.team?.projectManager?.fullName, 1)}
            {dataRow('Start date', dateFormatter(job.startDate), 2)}
            {dataRow('Last active', dateFormatter(job.endDate), 3)}
        </Box>
    </Sheet>
}
