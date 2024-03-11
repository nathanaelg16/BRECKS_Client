'use client'

import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Red_Hat_Display} from "next/font/google";
import {Alert, DialogContent, Divider, Drawer, Grid, IconButton, LinearProgress, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import {DAYS, MONTHS} from "@/app/utils";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import ReportIcon from '@mui/icons-material/Report'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tool from "@/app/(app)/job/[id]/(report)/(tools)/tool";
import EditableComponent from "@/app/(app)/job/[id]/(report)/editable_component";
import Toolbar from "@/app/(app)/job/[id]/(report)/(tools)/toolbar";
import CrewViewer from "@/app/(app)/job/[id]/(report)/crew_viewer";
import {CustomTextArea as Textarea} from "@/app/(app)/job/[id]/(report)/custom_text_area"
import HistoryPopper from "@/app/(app)/job/[id]/(report)/(tools)/history_popper";
import {DateTime} from "luxon";
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
    const [timestamp, setTimestamp] = useState(0)
    const [editedFieldsCount, setEditedFieldsCount] = useState(0)
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [alert, setAlert] = useState('')
    const [historyPopperAnchor, setHistoryPopperAnchor] = useState(null)
    const [historical, setHistorical] = useState(false)
    const [reportError, setReportError] = useState(false)

    const setData = useCallback((report) => {
        setWeather(report.weather)
        setVisitors(report.visitors)
        setCrew(Map(report.crew))
        setWorkDescriptions(List(report.workDescriptions))
        setMaterials(List(report.materials))
        setReportBy(report.reportBy?.fullName)
        setTimestamp(isNaN(report.timestamp) ? 0 : Number(report.timestamp))
    }, [setWeather, setVisitors, setCrew, setWorkDescriptions, setMaterials, setReportBy, setTimestamp])

    const fetchReportData = useCallback((callback_fn = () => {}) => {
        if (date) {
            postman.get('/reports?' + new URLSearchParams({job: job.id, startDate: date, endDate: date}))
                .then((response) => {
                if (response.status === 200) {
                    const report = response.data[0]
                    reportRef.current = report
                    setData(report)
                    setReportError(false)
                } else throw new Error(`Response status code: ${response.status}`)
            }).catch((error) => {
                const report = {}
                reportRef.current = report
                setData(report)
                setAlert('An error occurred fetching report details.')
                setReportError(true)
            }).finally(() => {
                callback_fn()
            })
        }
    }, [job, date, setData])

    const fetchHistoricalReport = useCallback((id, callback_fn = () => {}) => {
        if (date) {
            postman.get('/reports/history?' + new URLSearchParams({job: job.id, date: date, id: id}))
                .then((response) => {
                    if (response.status === 200) {
                        reportRef.current = response.data
                        setData(response.data)
                    } else setAlert('An error occurred retrieving the requested report.')
                }).catch((error) => {
                    setAlert('An error occurred retrieving the requested report.')
            }).finally(() => {
                callback_fn()
            })
        }
    }, [job, date, setData])

    useEffect(() => {
        fetchReportData()
    }, [fetchReportData])

    useEffect(() => {
        setEditedFieldsCount(document.getElementsByClassName('edited').length)
    }, [setEditedFieldsCount, weather, visitors, crew, workDescriptions, materials])

    const cancelEdits = () => {
        setEditing(false)
        setData(reportRef.current)
    }

    const handleClose = () => {
        cancelEdits()
        onClose()
    }

    const saveChanges = () => {
        setEditing(false)
        setShowProgressBar(true)

        const report = {
            id: reportRef.current.id,
            reportDate: date,
            jobID: job.id,
            weather: weather,
            crew: crew,
            visitors: visitors,
            workDescriptions: workDescriptions,
            materials: materials
        }

        postman.put('/reports', report).then((response) => {
            fetchReportData(() => setShowProgressBar(false))
        }).catch((error) => {
            setAlert('An error occurred saving the report. Please try again.')
            setShowProgressBar(false)
            cancelEdits()
        })
    }

    const handleHistoricalReportSelection = (id, current) => {
        setShowProgressBar(true)
        const callback = () => {
            setShowProgressBar(false)
            setHistorical(!current)
        }

        if (current) setTimeout(() => fetchReportData(callback), 2000)
        else setTimeout(() => fetchHistoricalReport(id, callback), 2000)
    }

    const toFullDate = (dateStr) => {
        const date = new Date(dateStr)
        return `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    }

    const calculateCrewSize = (c) => {
        return c.reduce((sum, val) => sum + val, 0)
    }

    const setToBlank = () => {
        if (editing) setData({})
    }

    const unarchiveReport = () => {
        if (historical) {
            setShowProgressBar(true)
            postman.post('/reports/restore?' + new URLSearchParams({job: job.id, date: date, id: reportRef.current.id}))
                .then((response) => {
                    if (response.status === 200) setTimeout(() => fetchReportData(() => setHistorical(false)), 1000)
                    else throw new Error(`Response status code: ${response.status}`)
                }).catch((error) => setAlert('An error occurred performing the requested action.'))
                .finally(() => setShowProgressBar(false))
        }
    }

    const createDatum = (key, value, sx = {}) => <Grid sx={{my: 1, ...sx.grid}} xs={12}>
        <Stack sx={{px: 1, ...sx.stack}} direction='row' spacing={2} justifyContent='flex-start' alignItems='center' useFlexGap>
            <Typography className={RedHatFont.className} sx={{color: 'black', ...sx.key}} textAlign='left' level='title-lg'>
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

    const createInputListDatum = (key, [value, setValue], listSX = {}, sx = {}) => {
        const renderInputComponent = (props) => <Textarea minRows={1}
              className={RedHatFont.className} size='lg'
              {...props}
              endDecorator={<Stack sx={{ml: 'auto'}} direction='row' useFlexGap justifyContent='flex-end' alignItems='center'>
                  {props.endDecorator}
                  {!props.disabled &&
                      <Tool name='Remove' icon={<CloseIcon />} onClick={props.onDelete}
                            props={{variant: 'plain'}}
                            sx={{
                                '--IconButton-size': '28px',
                                background: 'transparent',
                                '&:hover': {
                                    background: 'transparent',
                                    color: 'var(--joy-palette-danger-500)'
                                }
                      }} />}
              </Stack>}
        />

        const createRow = (val, id = null) => <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1} useFlexGap key={id} sx={{width: 1, px: 2}}>
            <CircleIcon sx={{color: 'var(--joy-palette-primary-800)', fontSize: '12px'}} />
            <EditableComponent renderComponent={renderInputComponent} editing={editing} value={val} onEdit={(newValue) => setValue(value.set(id, newValue))} onDelete={() => setValue(value.remove(id))} />
        </Stack>

        const renderOuterComponent = (props) => {
            const editingSX = editing ? {py: 2, pl: 2} : {}
            return <Stack spacing={editing ? 1 : 0} sx={{width: 1, ...listSX, ...editingSX}} className={`${props.className} editableComponentContainer`}>
                {props.value.map((val, id) => createRow(val, id))}
                {editing && <Divider sx={{pt: 1}}><Tool onClick={() => setValue(value.push(''))} props={{variant: 'outlined'}} name='Add' icon={<AddIcon />} sx={{background: 'transparent', '&:hover': {background: 'var(--joy-palette-primary-100)', color: 'black'}}}></Tool></Divider>}
                <Stack direction='row' justifyContent='flex-end' alignItems='center'>
                    {props.endDecorator}
                </Stack>
            </Stack>
        }

        return createDatum(key, <EditableComponent value={value} onEdit={(newValue) => setValue(newValue)} renderComponent={renderOuterComponent} editing={editing} /> , {...sx, stack: {alignItems: 'flex-start', flexDirection: 'column', width: 1}})
    }
    const createTextDatum = (key, value, textSX = {}, sx = {}) => createDatum(key, <Typography sx={{color: 'black', ...textSX}} className={RedHatFont.className} textAlign='left' level='body-lg'>{value}</Typography>, sx)

    const historyToolAddlSX = Boolean(historyPopperAnchor) ? {background: 'rgba(0,0,0)', color: '#FFFFFF', opacity: 1} : {}

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
        <DialogContent sx={{userSelect: 'none'}} id='reportViewer'>
            <Box sx={{position: 'relative'}}>
                <Box id='header' className={`print ${historical ? 'historical' : ''}`} sx={{py: 2, width: 1, zIndex: 0, position: 'relative', borderBottom: '2px solid #000000', background: 'var(--joy-palette-primary-300)'}}>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h1'>{job.address}</Typography>
                    <Typography sx={{color: 'black'}} className={RedHatFont.className} textAlign='center' level='h3'>Job Report{historical && ' (Archived)'}</Typography>
                </Box>
            </Box>
            <Box className={'print'} sx={{px: 1, width: 1, position: 'relative'}}>
                <Toolbar editing={editing} sx={{zIndex: 1, position: 'sticky', top: 0}}>
                    {historical && <Tool disabled={showProgressBar || reportError} name='Unarchive' icon={<UnarchiveIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#EFDECD'}}} onClick={unarchiveReport} />}
                    {editing ? <>
                        <Tool disabled={showProgressBar || reportError} name='Reset' icon={<ClearAllIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#B284BE'}}} onClick={setToBlank} />
                        <Tool disabled={showProgressBar  || reportError} name='Revert' icon={<RestoreIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#E0D2A4'}}} onClick={cancelEdits} />
                        <Tool disabled={showProgressBar || editedFieldsCount === 0 || reportError} name='Save' icon={<SaveIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: 'var(--joy-palette-success-400)'}}} onClick={saveChanges} />
                    </> : <>
                        <Tool disabled={showProgressBar || reportError} name='Edit' icon={<EditIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#E0D2A4'}}} onClick={() => setEditing(true)} />
                        <Tool disabled={showProgressBar || reportError} name='History' icon={<HistoryToggleOffIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#E0D2A4'}, ...historyToolAddlSX}} onClick={(e) => setHistoryPopperAnchor(historyPopperAnchor ? null : e.currentTarget)} />
                        <Tool disabled={showProgressBar || reportError} name='Print' icon={<PrintIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#AF6E4D'}}} onClick={() => {}} />
                    </>}
                    <Tool disabled={showProgressBar || reportError} name='Close' icon={<CloseIcon />} sx={{'&:hover': {background: 'rgba(0,0,0,0.80)', color: '#efa5a5'}}} onClick={handleClose} />
                </Toolbar>
                <Stack alignItems='center' sx={{zIndex: 9999, position: 'absolute', top: 2, left: 0, width: 1}}>
                    {alert && <Alert variant='solid' sx={{ width: 0.80}} color='danger' startDecorator={<ReportIcon sx={{color: 'white'}} />} endDecorator={<IconButton sx={{background: 'transparent', '&:hover': {background: 'transparent', border: '1px solid white'}}} onClick={() => setAlert('')}><CloseIcon sx={{color: 'white'}} /></IconButton>}>
                        <Stack>
                            <Typography fontWeight='700' className={RedHatFont.className} sx={{color: 'white'}}>Error</Typography>
                            <Typography fontWeight='400' className={RedHatFont.className} sx={{color: 'white'}}>{alert}</Typography>
                        </Stack>
                    </Alert>}
                </Stack>
                <Box className={'noprint'} sx={{position: 'absolute', zIndex: 1, top: 2, width: 1, left: 0, px: 1}}>
                    {showProgressBar && <LinearProgress variant='plain' sx={{color: 'var(--joy-palette-success-400)'}} />}
                </Box>
                <Grid className={`${historical ? 'historical' : ''} report-container`} container spacing={2} sx={{flexGrow: 1, mx: 'auto', width: 1, position: 'relative', zIndex: 0}} alignItems='center'>
                    {createTextDatum('Report Date', toFullDate(date), {color: 'black'}, {stack: { py: 1}, key: {}, value: {color: 'black'}, grid: {}})}
                    {createInputDatum('Weather', [weather, setWeather])}
                    {createInputDatum('Visitors', [visitors, setVisitors])}
                    {createDatum('Crew', <CrewViewer editing={editing} withCrew={[crew, setCrew]}/>, {stack: {alignItems: 'flex-start'}, key: {pt: 1}})}
                    {createTextDatum('Total Crew Size', calculateCrewSize(crew))}
                    {createInputListDatum('Work Description', [workDescriptions, setWorkDescriptions])}
                    {createInputListDatum('Materials', [materials, setMaterials])}
                    {createTextDatum('Submitted by', reportBy)}
                    {createTextDatum('Timestamp', DateTime.fromSeconds(timestamp).toFormat("MM/dd/yy hh:mm:ss a"))}
                </Grid>
            </Box>
            <HistoryPopper onSelection={(id, current) => handleHistoricalReportSelection(id, current)} withAlert={[alert, setAlert]} date={date} anchor={historyPopperAnchor} onClose={() => setHistoryPopperAnchor(null)} />
        </DialogContent>
    </Drawer>
}

// todo program print button
