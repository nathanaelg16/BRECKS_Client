'use client'

import {Grid, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import {Red_Hat_Display} from "next/font/google";
import {useContext, useEffect, useState} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import CrewViewer from "@/app/(app)/job/[id]/report/[date]/crew_viewer";
import {DAYS, MONTHS} from "@/app/utils";

const {Map} = require('immutable')
const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function ReportViewer({params}) {
    const [job, updateJob] = useContext(JobContext)
    const [weather, setWeather] = useState('')
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState([''])
    const [materials, setMaterials] = useState([''])
    const [reportBy, setReportBy] = useState('')

    useEffect(() => {
        const prepareData = (report) => {
            setWeather(report.weather)
            setVisitors(report.visitors)
            setCrew(Map(report.crew))
            setWorkDescriptions(report.workDescriptions)
            setMaterials(report.materials)
            setReportBy(report.reportBy.fullName)
        }

        const token = sessionStorage.getItem('token')

        postman.get('/reports?' + new URLSearchParams({job: job.id, startDate: params.date, endDate: params.date}), {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                prepareData(response.data[0])
            } else {
                //console.log(response)
                // todo implement error handling
            }
        }).catch((error) => {
            //console.log(error)
            // todo implement error handling
        })
    }, [job, params.date])

    const createDatum = (key, value, sx = {}) => <Grid sx={{my: 2, ...sx.grid}} xs={12}>
        <Stack sx={{px: 10, ...sx.stack}} direction='row' spacing={2} justifyContent='flex-start' alignItems='center' useFlexGap>
            <Typography className={RedHatFont.className} sx={{color: 'black', ...sx.key}} textAlign='right' level='title-lg'>
                {key}
            </Typography>
            <Box className={RedHatFont.className} sx={{display: 'contents',...sx.value}}>
                {value}
            </Box>
        </Stack>
    </Grid>

    const toFullDate = (dateStr) => {
        const date = new Date(dateStr)
        return `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    }

    const calculateCrewSize = (c) => {
        return c.reduce((sum, val) => sum + val, 0)
    }

    const createInputDatum = (key, value, inputSX = {}, sx = {}) => createDatum(key, <Input sx={{...inputSX}} slotProps={{input: {style: {textAlign: 'center'}}}} variant='plain' size='lg' className={RedHatFont.className} value={value} />, sx)
    const createInputListDatum = (key, value, inputSX = {}, listSX = {}, sx = {}) => createDatum(key, <Stack sx={{...listSX}}>
            {value.map((val, id) => <Input key={id} sx={{...inputSX}} className={RedHatFont.className} variant='plain' size='lg' value={val} />)}
        </Stack>, {...sx, stack: {alignItems: 'flex-start'}, key: {pt: 1}})
    const createTextDatum = (key, value, textSX = {}, sx = {}) => createDatum(key, <Typography sx={{...textSX}} className={RedHatFont.className} textAlign='center' level='body-lg'>{value}</Typography>, sx)

    return <Box sx={{pt: 2, display: 'flex', flexDirection: 'column'}}>
        <Grid container spacing={2} sx={{ flexGrow: 1, width: 0.5, mx: 'auto', border: '1px solid black' }} alignItems='center'>
            <Grid sx={{borderBottom: '1px solid black', background: 'var(--joy-palette-primary-300)'}} xs={12}>
                <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h1'>{job.address}</Typography>
                <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h3'>Job Report</Typography>
            </Grid>
            {createTextDatum('Report Date', toFullDate(params.date), {color: 'black'}, {stack: { py: 1}, key: {}, value: {color: 'black'}, grid: {}})}
            {createInputDatum('Weather', weather)}
            {createInputDatum('Visitors', visitors)}
            {createDatum('Crew', <CrewViewer withCrew={[crew, setCrew]} />)}
            {createTextDatum('Total Crew Size', calculateCrewSize(crew))}
            {createInputListDatum('Work Description', workDescriptions)}
            {createInputListDatum('Materials', materials)}
            {createTextDatum('Submitted by', reportBy)}
        </Grid>
    </Box>
}
