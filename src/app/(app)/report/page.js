'use client'

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {Chip, CircularProgress, FormHelperText, Option, Select, Sheet, Stack} from "@mui/joy";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {useRouter, useSearchParams} from "next/navigation";
import CrewManager from "@/app/(app)/report/crew_manager";
import DescriptionFields from "@/app/(app)/report/description_fields";

const {Map, List} = require('immutable')

export default function Report() {
    const [reportDate, setReportDate] = useState(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}))
    const [dateError, setDateError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jobSites, setJobSites] = useState([]);
    const [selectedJobSite, setSelectedJobSite] = useState(0);
    const [error, setError] = useState(false)
    const [isWeatherRequired, setWeatherRequired] = useState(false)
    const [weather, setWeather] = useState('')
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState(List(['']))
    const [materialDescriptions, setMaterialDescriptions] = useState(List(['']))
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        const handleError = (message) => setError('An error occurred fetching the job sites.\n' + message)
        postman.get('/jobs', {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setJobSites(response.data)
                const params = new URLSearchParams(searchParams)
                if (params.has('job')) setSelectedJobSite(parseInt(params.get('job')))
            }
        }).catch((error) => handleError(error.message)) //todo implement better error handling
    }, [searchParams])

    useEffect(() => {
        const error = new Date() < new Date(reportDate)
        setDateError(error)

        if (error) {
            setWeather('')
            return
        }

        setWeatherLoading(true)

        const token = sessionStorage.getItem('token')
        const params = new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}) === reportDate ? new URLSearchParams() : new URLSearchParams({date: reportDate})
        postman.get('/weather?' + params, {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setWeatherRequired(false)
                setWeather(response.data.summary)
            } else {
                setWeatherRequired(true)
            }
        }).catch((error) => {
            // todo implement error handling
            console.log(error)
            setWeatherRequired(true)
        }).finally(() => {
            setWeatherLoading(false)
        })
    }, [reportDate])

    const submitReport = () => {
        setLoading(true)
        const token = sessionStorage.getItem('token')
        const handleError = (message) => setError('An error occurred submitting the report.\n' + message)
        postman.post('/reports', {
            jobID: selectedJobSite,
            reportDate: reportDate,
            weather: weather,
            crew: crew.mapKeys((k) => k.shortName),
            visitors: visitors,
            workDescriptions: workDescriptions,
            materials: materialDescriptions
        }, {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) router.push('/report/success')
            else handleError('Server Response: ' + response.statusText)
        }).catch((error) => {
            handleError(error.message)
        }).finally(() => setLoading(false))
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
                            <FormControl error={dateError}>
                                <FormLabel>Report Date</FormLabel>
                                <Input required type="date"
                                       value={reportDate}
                                       onChange={(e) => setReportDate(e.target.value)}/>
                                {dateError && <FormHelperText>Report date must not be in the future.</FormHelperText>}
                            </FormControl>
                            <FormControl error={isWeatherRequired && weather === ''}>
                                <FormLabel>Weather</FormLabel>
                                <Input required={isWeatherRequired}
                                       value={weather}
                                       name="weather"
                                       onChange={(e) => setWeather(e.target.value)}
                                       disabled={weatherLoading}
                                       endDecorator={weatherLoading && <CircularProgress size='sm' />}
                                />
                                {isWeatherRequired &&
                                    <FormHelperText color="primary">Weather info is required when submitting past
                                        reports.</FormHelperText>}
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

                            <Button type="submit" loading={loading}>Submit</Button>
                        </Stack>
                    </form>
                </Box>
            </Sheet>
        </Box>
    </>
}

// todo work on reports submission
