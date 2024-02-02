'use client'

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {FormHelperText, Select, Sheet, Stack, Option} from "@mui/joy";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {useRouter} from "next/navigation";

export default function Report() {
    const [reportDate, setReportDate] = useState(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}))
    const [dateError, setDateError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jobSites, setJobSites] = useState([]);
    const [selectedJobSite, setSelectedJobSite] = useState(0);
    const [error, setError] = useState(false)
    const [isWeatherRequired, setWeatherRequired] = useState(false)
    const [weather, setWeather] = useState('')
    const router = useRouter()

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        const handleError = (message) => setError('An error occurred fetching the job sites.\n' + message)
        postman.get('/jobs', {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) setJobSites(response.data)
            else {
                console.log(response)
            }
        }).catch((error) => handleError(error.message)) //todo implement better error handling
    }, [])

    useEffect(() => {
        setDateError(new Date() < new Date(reportDate))
    }, [reportDate])

    const submitReport = (data) => {
        setTimeout(() => {
            setLoading(false)
            router.push('/report/success')
        }, 2000)
    }

    return <>
        <Box sx={{display: 'flex'}}>
            <Sheet sx={{mx: 'auto', width: '800px', display: 'flex', flexDirection: 'column', px: 4, pb: 4}}>
                <Typography level={'h1'} sx={{my: 2, mb: 0, mx: 'auto'}}>Daily Job Report</Typography>
                <Box sx={{my: 2, mb: 0}}>
                    <form autoComplete="off" onSubmit={(event) => {
                        event.preventDefault()
                        setLoading(true)
                        const formElements = event.currentTarget.elements;
                        const data = {
                            // address: formElements.address.value,
                            reportDate: formElements.date.value,
                            weather: formElements.weather.value,
                            crewSize: formElements.crewSize.value,
                            visitors: formElements.visitors.value,
                            workArea1: formElements.workArea1.value,
                            workArea2: formElements.workArea2.value,
                            workArea3: formElements.workArea3.value,
                            workArea4: formElements.workArea4.value,
                            workArea5: formElements.workArea5.value,
                            materials1: formElements.materials1.value,
                            materials2: formElements.materials2.value,
                            materials3: formElements.materials3.value,
                            materials4: formElements.materials4.value,
                            subs: formElements.subs.value
                        }
                        submitReport(data)
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
                                       onChange={(e) => setReportDate(e.target.value)}
                                       name="date"/>
                                {dateError && <FormHelperText>Report date must not be in the future.</FormHelperText>}
                            </FormControl>
                            <FormControl error={isWeatherRequired && weather === ''}>
                                <FormLabel>Weather</FormLabel>
                                <Input required={isWeatherRequired}
                                       placeholder={isWeatherRequired ? "Required" : "Optional"} name="weather"
                                       onChange={(e) => setWeather(e.target.value)}/>
                                {isWeatherRequired &&
                                    <FormHelperText color="primary">Weather info is required when submitting past
                                        reports.</FormHelperText>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Crew Size</FormLabel>
                                <Input required name="crewSize"/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Visitors Present</FormLabel>
                                <Input placeholder="(Client, architect, etc...)" name="visitors"/>
                                <FormHelperText>If no visitors are present, leave blank.</FormHelperText>
                            </FormControl>
                            <Typography level="title-md">
                                Work Taking Place On-site
                            </Typography>
                            <FormControl>
                                <Input required placeholder="Type/Location/Drawing/Facade" name="workArea1"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="workArea2"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="workArea3"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="workArea4"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="workArea5"/>
                            </FormControl>
                            <Typography level="title-md">
                                Materials Needed for the Week
                            </Typography>
                            <FormControl>
                                <Input placeholder="Optional" name="materials1"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="materials2"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="materials3"/>
                            </FormControl>
                            <FormControl>
                                <Input placeholder="Optional" name="materials4"/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Subcontractors Present</FormLabel>
                                <Input required name="subs"/>
                            </FormControl>
                            <Button type="submit" loading={loading}>Submit</Button>
                        </Stack>
                    </form>
                </Box>
            </Sheet>
        </Box>
    </>
}
