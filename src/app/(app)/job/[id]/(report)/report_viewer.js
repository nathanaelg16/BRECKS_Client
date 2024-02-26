'use client'

import {DialogContent, Drawer, Grid, IconButton, Stack, Textarea, Tooltip} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";
import {useContext, useEffect, useState} from "react";
import CrewViewer from "@/app/(app)/job/[id]/(report)/crew_viewer";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import {DAYS, MONTHS} from "@/app/utils";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import "./report_viewer.css"

const {Map} = require('immutable')
const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function ReportViewer({open, onClose, date, anchor}) {
    const [job, updateJob] = useContext(JobContext)
    const [weather, setWeather] = useState('')
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState([''])
    const [materials, setMaterials] = useState([''])
    const [reportBy, setReportBy] = useState('')

    useEffect(() => {
        if (date) {
            const prepareData = (report) => {
                setWeather(report.weather)
                setVisitors(report.visitors)
                setCrew(Map(report.crew))
                setWorkDescriptions(report.workDescriptions)
                setMaterials(report.materials)
                setReportBy(report.reportBy.fullName)
            }

            const token = sessionStorage.getItem('token')

            postman.get('/reports?' + new URLSearchParams({job: job.id, startDate: date, endDate: date}), {
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
        }
    }, [job, date])

    const handleToolbarOnScroll = (event) => {
        const toolbar = document.getElementById('toolbar')
        const headerRect = document.getElementById('header').getBoundingClientRect()

        if (window.scrollY >= headerRect.bottom) {
            toolbar.style.position = 'fixed'
            toolbar.style.bottom = 'auto'
        } else {
            toolbar.style.position = 'absolute'
            toolbar.style.bottom = '0'
        }
    }

    const toFullDate = (dateStr) => {
        const date = new Date(dateStr)
        return `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    }

    const calculateCrewSize = (c) => {
        return c.reduce((sum, val) => sum + val, 0)
    }

    const createDatum = (key, value, sx = {}) => <Grid sx={{my: 1, ...sx.grid}} xs={12}>
        <Stack sx={{px: 1, ...sx.stack}} direction='row' spacing={2} justifyContent='flex-start' alignItems='center' useFlexGap>
            <Typography className={RedHatFont.className} sx={{color: 'black', ...sx.key}} textAlign='right' level='title-lg'>
                {key}
            </Typography>
            <Box className={RedHatFont.className} sx={{display: 'contents',...sx.value}}>
                {value}
            </Box>
        </Stack>
    </Grid>

    const createInputDatum = (key, value, inputSX = {}, sx = {}) => createDatum(key, <Textarea placeholder='N/A' disabled minRows={1} sx={{color: 'black', '.Mui-disabled': {color: 'black'}, ...inputSX}} variant='plain' size='lg' className={RedHatFont.className} value={value} />, sx)
    const createInputListDatum = (key, value, inputSX = {}, listSX = {}, sx = {}) => createDatum(key, <Stack sx={{width: 1, ...listSX}}>
        {value.map((val, id) => <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1} useFlexGap key={id} sx={{width: 1, px: 2}}><CircleIcon sx={{color: 'var(--joy-palette-primary-800)', fontSize: '12px'}} /><Textarea disabled minRows={1} sx={{width: 1, color: 'black', '.Mui-disabled': {color: 'black'}, ...inputSX}} className={RedHatFont.className} variant='plain' size='lg' value={val} /></Stack>)}
        </Stack>, {...sx, stack: {alignItems: 'flex-start', flexDirection: 'column', width: 1}})
    const createTextDatum = (key, value, textSX = {}, sx = {}) => createDatum(key, <Typography sx={{color: 'black', ...textSX}} className={RedHatFont.className} textAlign='center' level='body-lg'>{value}</Typography>, sx)

    return <Drawer anchor={anchor} size='md' variant='plain' open={open} onClose={onClose} slotProps={{
        content: {
            sx: {
                m: 2,
                borderRadius: 15,
                border: '2px solid black',
                boxShadow: 'none',
                height: '97svh'
            },
        },
    }} sx={{}} >
        <DialogContent sx={{userSelect: 'none'}} onScroll={(e) => handleToolbarOnScroll(e)} id='reportViewer'>
            <Box sx={{position: 'relative'}}>
                <Stack id='toolbar' direction='row' justifyContent='flex-end' alignItems='center' spacing={1} sx={{pr: 1, py: 1, width: 1, zIndex: 1, position: 'absolute', bottom: 0}}>
                    <Tooltip sx={{background: 'black', color: 'white'}} className={RedHatFont.className} title='Delete'><IconButton className={'tool'} sx={{background: 'black', '&:hover': {background: 'rgba(0,0,0,0.80)', color: '#CF4646F8'}}}><DeleteForeverIcon /></IconButton></Tooltip>
                    <Tooltip sx={{background: 'black', color: 'white'}} className={RedHatFont.className} title='Edit'><IconButton className={'tool'} sx={{background: 'black', '&:hover': {background: 'rgba(0,0,0,0.80)', color: '#FFFFFFF0'}}}><EditIcon /></IconButton></Tooltip>
                    <Tooltip sx={{background: 'black', color: 'white'}} className={RedHatFont.className} title='Print'><IconButton className={'tool'} sx={{background: 'black', '&:hover': {background: 'rgba(0,0,0,0.80)', color: '#FFFFFFF0'}}}><PrintIcon /></IconButton></Tooltip>
                    <Tooltip sx={{background: 'black', color: 'white'}} className={RedHatFont.className} title='Close'><IconButton className={'tool'} onClick={onClose} sx={{background: 'black', '&:hover': {background: 'rgba(0,0,0,0.80)', color: '#FFFFFFF0'}}}><CloseIcon /></IconButton></Tooltip>
                </Stack>
                <Box id='header' className={'print'} sx={{py: 2, width: 1, zIndex: 0, position: 'relative', borderBottom: '2px solid #000000', background: 'var(--joy-palette-primary-300)'}}>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h1'>{job.address}</Typography>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h3'>Job Report</Typography>
                </Box>
            </Box>
            <Box className={'print'} sx={{px: 1, width: 1, zIndex: 0, position: 'relative'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1, mx: 'auto', width: 1}} alignItems='center'>
                    {createTextDatum('Report Date', toFullDate(date), {color: 'black'}, {stack: { py: 1}, key: {}, value: {color: 'black'}, grid: {}})}
                    {createInputDatum('Weather', weather)}
                    {createInputDatum('Visitors', visitors)}
                    {createDatum('Crew', <CrewViewer withCrew={[crew, setCrew]} />, {stack: {alignItems: 'flex-start'}, key: {pt: 1}})}
                    {createTextDatum('Total Crew Size', calculateCrewSize(crew))}
                    {createInputListDatum('Work Description', workDescriptions)}
                    {createInputListDatum('Materials', materials)}
                    {createTextDatum('Submitted by', reportBy)}
                </Grid>
            </Box>
        </DialogContent>
    </Drawer>
}

// todo program print button
