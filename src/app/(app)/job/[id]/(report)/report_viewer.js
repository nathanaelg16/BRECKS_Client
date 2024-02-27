'use client'

import {DialogContent, Drawer, Grid, Stack, Textarea} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import CrewViewer from "@/app/(app)/job/[id]/(report)/crew_viewer";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import {DAYS, MONTHS} from "@/app/utils";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import Tool from "@/app/(app)/job/[id]/(report)/tool";
import EditableComponent from "@/app/(app)/job/[id]/(report)/(components)/editable_component";
import "./report_viewer.css"

const {Map, List} = require('immutable')
const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function ReportViewer({open, onClose, date, anchor}) {
    const [job, updateJob] = useContext(JobContext)
    const [editing, setEditing] = useState(false)
    const reportRef = useRef({})
    const [weather, setWeather] = useState('')
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState(List(['']))
    const [materials, setMaterials] = useState(List(['']))
    const [reportBy, setReportBy] = useState('')

    const setData = useCallback((report) => {
        setWeather(report.weather)
        setVisitors(report.visitors)
        setCrew(Map(report.crew))
        setWorkDescriptions(List(report.workDescriptions))
        setMaterials(List(report.materials))
        setReportBy(report.reportBy.fullName)
    }, [setWeather, setVisitors, setCrew, setWorkDescriptions, setMaterials, setReportBy])

    const fetchReportData = useCallback((token) => {
        if (date) {
            postman.get('/reports?' + new URLSearchParams({job: job.id, startDate: date, endDate: date}), {
                headers: {
                    Authorization: 'BearerJWT ' + token
                }
            }).then((response) => {
                if (response.status === 200) {
                    const report = response.data[0]
                    reportRef.current = report
                    setData(report)
                } else {
                    //console.log(response)
                    // todo implement error handling
                }
            }).catch((error) => {
                //console.log(error)
                // todo implement error handling
            })
        }
    }, [job, date, setData])

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        fetchReportData(token)
    }, [fetchReportData])

    const cancelEdits = () => {
        setEditing(false)
        setData(reportRef.current)
    }

    const handleClose = () => {
        cancelEdits()
        onClose()
    }

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

    const createInputDatum = (key, [value, setValue], inputSX = {}, sx = {}) => {
        const renderComponent = (props) => <Textarea placeholder='N/A' minRows={1} sx={{color: 'black', '.Mui-disabled': {color: 'black'}, ...inputSX}} size='lg' className={RedHatFont.className} {...props} />
        return createDatum(key, <EditableComponent editing={editing} value={value} onEdit={setValue} renderComponent={renderComponent} />, sx)
    }
    const createInputListDatum = (key, [value, setValue], inputSX = {}, listSX = {}, sx = {}) => {
        const createRow = (val, id = null) => <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1} useFlexGap key={id} sx={{width: 1, px: 2}}>
            <CircleIcon sx={{color: 'var(--joy-palette-primary-800)', fontSize: '12px'}} />
            <EditableComponent renderComponent={renderComponent} editing={editing} value={val} onEdit={(newValue) => setValue(value.set(id, newValue))} />
        </Stack>
        const renderComponent = (props) => <Textarea minRows={1} sx={{width: 1, color: 'black', '.Mui-disabled': {color: 'black'}, ...inputSX}} className={RedHatFont.className} size='lg' {...props} />
        return createDatum(key, <Stack spacing={editing ? 1 : 0} sx={{width: 1, ...listSX}}>
            {value.map((val, id) => createRow(val, id))}
        </Stack>, {...sx, stack: {alignItems: 'flex-start', flexDirection: 'column', width: 1}})
    }
    const createTextDatum = (key, value, textSX = {}, sx = {}) => createDatum(key, <Typography sx={{color: 'black', ...textSX}} className={RedHatFont.className} textAlign='center' level='body-lg'>{value}</Typography>, sx)

    return <Drawer anchor={anchor} size='md' variant='plain' open={open} onClose={handleClose} slotProps={{
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
                    <Tool name='Delete' icon={<DeleteForeverIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#CF4646F8'}}} onClick={() => {}} />
                    {editing ? <>
                        <Tool name='Revert' icon={<RestoreIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#E0D2A4'}}} onClick={cancelEdits} />
                        <Tool name='Save' icon={<SaveIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: 'var(--joy-palette-success-400)'}}} onClick={() => {}} />
                    </> : <>
                        <Tool name='Edit' icon={<EditIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#E0D2A4'}}} onClick={() => setEditing(true)} />
                        <Tool name='Print' icon={<PrintIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#AF6E4D'}}} onClick={() => {}} />
                    </>}
                    <Tool name='Close' icon={<CloseIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#efa5a5'}}} onClick={handleClose} />
                </Stack>
                <Box id='header' className={'print'} sx={{py: 2, width: 1, zIndex: 0, position: 'relative', borderBottom: '2px solid #000000', background: 'var(--joy-palette-primary-300)'}}>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h1'>{job.address}</Typography>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h3'>Job Report</Typography>
                </Box>
            </Box>
            <Box className={'print'} sx={{px: 1, width: 1, zIndex: 0, position: 'relative'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1, mx: 'auto', width: 1}} alignItems='center'>
                    {createTextDatum('Report Date', toFullDate(date), {color: 'black'}, {stack: { py: 1}, key: {}, value: {color: 'black'}, grid: {}})}
                    {createInputDatum('Weather', [weather, setWeather])}
                    {createInputDatum('Visitors', [visitors, setVisitors])}
                    {createDatum('Crew', <CrewViewer withCrew={[crew, setCrew]} />, {stack: {alignItems: 'flex-start'}, key: {pt: 1}})}
                    {createTextDatum('Total Crew Size', calculateCrewSize(crew))}
                    {createInputListDatum('Work Description', [workDescriptions, setWorkDescriptions])}
                    {createInputListDatum('Materials', [materials, setMaterials])}
                    {createTextDatum('Submitted by', reportBy)}
                </Grid>
            </Box>
        </DialogContent>
    </Drawer>
}

// todo program print button
