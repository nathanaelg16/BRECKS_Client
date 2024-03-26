'use client'

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {Chip, CircularProgress, FormHelperText, Option, Select, Sheet, Stack} from "@mui/joy";
import {useCallback, useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {useRouter, useSearchParams} from "next/navigation";
import CrewManager from "@/app/(app)/report/crew_manager";
import DescriptionFields from "@/app/(app)/report/description_fields";
import {SnackbarContext} from "@/app/(app)/context";

const {Map, List} = require('immutable')
const {DateTime, Interval} = require('luxon')

export default function Report() {
    const setSnackbar = useContext(SnackbarContext)
    const [reportDate, setReportDate] = useState(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}))
    const [dateError, setDateError] = useState('')
    const [loading, setLoading] = useState(false)
    const [jobSites, setJobSites] = useState([]);
    const [selectedJobSite, setSelectedJobSite] = useState(0);
    const [weather, setWeather] = useState('')
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState(List(['']))
    const [materialDescriptions, setMaterialDescriptions] = useState(List(['']))
    const [formSubmissionDisabled, setFormSubmissionDisabled] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()

    const setError = useCallback((message) => setSnackbar('error', {text: message, vertical: 'top', horizontal: 'center', autoHideDuration: null, variant: 'solid', sx: {color: 'white'}, textSX: {color: 'white'}}), [setSnackbar])

    useEffect(() => {
        const handleError = (message) => setError('An error occurred fetching the job sites.\n' + message)
        postman.get('/jobs').then((response) => {
            if (response.status === 200) {
                setJobSites(response.data)
                const params = new URLSearchParams(searchParams)
                if (params.has('job')) setSelectedJobSite(parseInt(params.get('job')))
                if (params.has('date')) setReportDate(new Date(params.get('date')).toLocaleString("en-CA", {timeZone: "UTC", month: '2-digit', day: '2-digit', year: 'numeric'}))
            }
        }).catch((error) => handleError(error.message))
    }, [searchParams, setError])

    useEffect(() => {
        const error = new Date() < new Date(reportDate)
        setDateError(error ? 'Report date must not be in the future.' : '')

        if (error || reportDate === '') {
            setWeather('')
            return
        }

        setWeatherLoading(true)

        const params = new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}) === reportDate ? new URLSearchParams() : new URLSearchParams({date: reportDate})
        postman.get('/weather?' + params).then((response) => {
            setWeather(response.data.summary)
        }).catch((error) => {
            setWeather('')
        }).finally(() => {
            setWeatherLoading(false)
        })
    }, [reportDate])

    useEffect(() => {
        const currentReportDate = DateTime.fromISO(reportDate)
        if (reportDate && selectedJobSite) {
            postman.get(`/jobs/${selectedJobSite}/stats?` + new URLSearchParams({
                basis: 'week',
                value: currentReportDate.startOf('week').toISODate()
            }))
                .then(response => {
                    const activePeriods = response.data.statusHistory.ACTIVE.map(interval => Interval.fromDateTimes(DateTime.fromISO(interval.startDate), DateTime.fromISO(interval.endDate)))
                    if (!activePeriods.some((interval) => interval.contains(currentReportDate))) {
                        setFormSubmissionDisabled(true)
                        setError('This job site is not listed as active on the date selected.')
                    } else setFormSubmissionDisabled(false)
                })
        }
    }, [reportDate, selectedJobSite, setFormSubmissionDisabled, setError]);

    useEffect(() => {
        if (Boolean(selectedJobSite)) {
            const params = new URLSearchParams({job: selectedJobSite, date: reportDate})
            postman.get('/reports/exists?' + params).then((response) => {
                if (response.data.exists) setDateError('A report has already been submitted for this date.')
                else setDateError('')
            }).catch((error) => {
                setError(`An unexpected error occurred. Code: L96-${error.response ? 'RSP' : 'REQ'}`)
            })
        }
    }, [reportDate, selectedJobSite, setError]);

    const submitReport = () => {
        setLoading(true)
        let success = false
        const handleError = (message) => setError('An error occurred submitting the report.\n' + message)
        postman.post('/reports', {
            jobID: selectedJobSite,
            reportDate: reportDate,
            weather: weather,
            crew: crew.mapKeys((k) => k.shortName),
            visitors: visitors,
            workDescriptions: workDescriptions,
            materials: materialDescriptions
        }).then((response) => {
            success = (response.status === 200)
            if (!success) handleError('Server Response: ' + response.statusText)
        }).catch((error) => {
            handleError(error.message)
        }).finally(() => setTimeout(() => {
            setLoading(false)
            if (success) router.push('/report/success')
        }, 2000))
    }

    return <>
        <Box sx={{display: 'flex'}}>
            <Sheet sx={{mx: 'auto', width: '800px', display: 'flex', flexDirection: 'column', px: 4, pb: 4}}>
                <Typography level={'h1'} sx={{my: 2, mb: 0, mx: 'auto'}}>Daily Job Report</Typography>
                <Box sx={{my: 2, mb: 0}}>
                    <form autoComplete="off" onSubmit={(event) => {
                        event.preventDefault()
                        submitReport()
                    }}>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Project Address</FormLabel>
                                <Select required placeholder="Choose one…" value={selectedJobSite}
                                        onChange={(event, newValue) => {
                                            setSelectedJobSite(newValue)
                                        }}>
                                    {jobSites.map((jobSite) => <Option key={jobSite.id} value={jobSite.id}>{jobSite.address}</Option>)}
                                </Select>
                            </FormControl>
                            <FormControl error={!!dateError}>
                                <FormLabel>Report Date</FormLabel>
                                <Input required type="date"
                                       value={reportDate}
                                       onChange={(e) => setReportDate(e.target.value)}/>
                                {dateError && <FormHelperText>{dateError}</FormHelperText>}
                            </FormControl>
                            <FormControl error={false}>
                                <FormLabel>Weather</FormLabel>
                                <Input required={false}
                                       value={weather}
                                       name="weather"
                                       onChange={(e) => setWeather(e.target.value)}
                                       disabled={weatherLoading}
                                       endDecorator={weatherLoading && <CircularProgress size='sm' />}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Visitors Present</FormLabel>
                                <Input value={visitors} onChange={(e) => setVisitors(e.target.value)} placeholder="(Client, architect, etc...)" name="visitors"/>
                                <FormHelperText>If no visitors are present, leave blank.</FormHelperText>
                            </FormControl>

                            {/* ------------------------------------------------------------------------------------------------- */}
                            <Box component='div' sx={{border: '2px solid var(--joy-palette-primary-200)', p: 2}}>
                                <Typography sx={{mt: -1, color: 'var(--joy-palette-primary-700)'}} textAlign='center' fontWeight='900'>CREW</Typography>
                                <CrewManager withCrew={[crew, setCrew]}/>
                            </Box>
                            {/* ------------------------------------------------------------------------------------------------- */}

                            <DescriptionFields title='Work Taking Place On-site' placeholder='Description of work' descriptions={[workDescriptions, setWorkDescriptions]} required={true}/>
                            <DescriptionFields title='Materials Needed for the Week' placeholder='Materials needed' descriptions={[materialDescriptions, setMaterialDescriptions]} required={false}/>

                            <Sheet variant='soft' sx={{p: 1, pb: 5, background: '#E2DDDA'}}>
                                <Typography fontWeight='900' level="title-md" sx={{color: '#382C24'}}>Subcontractors Present</Typography>
                                <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2}}>
                                    {crew.filter((v, k) => k.shortName !== 'PRESERV').keySeq().map((contractor) => <Chip sx={{background: '#1F4461', color: '#ffffff'}} size='lg' key={contractor.shortName}><strong>{contractor.shortName}</strong></Chip>)}
                                </Box>
                            </Sheet>

                            <Button disabled={formSubmissionDisabled} type="submit" loading={loading}>Submit</Button>
                        </Stack>
                    </form>
                </Box>
            </Sheet>
        </Box>
    </>
}
