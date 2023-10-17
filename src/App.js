import '@fontsource/inter';
import './App.css';
import {
    Alert,
    Button, Checkbox,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Option,
    Select,
    Sheet,
    Stack,
    Typography
} from "@mui/joy";
import {useEffect, useState} from "react";
import axios from "axios";
import config from "./config";

function App() {
    const [reportDate, setReportDate] = useState(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}))
    const [dateError, setDateError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jobSites, setJobSites] = useState([]);
    const [selectedJobSite, setSelectedJobSite] = useState(0);
    const [error, setError] = useState(false)
    const [isWeatherRequired, setWeatherRequired] = useState(false)
    const [weather, setWeather] = useState('')

    useEffect(() => {
        const handleError = (message) => setError('An error occurred fetching the job sites.\n' + message)
        axios.get(config.listJobSites).then((response) => {
            if (response.status === 200)
                if (response.headers.has('X-Amz-Function-Error')) handleError(response.headers.get('X-Amz-Function-Error'))
                else {
                    setError(false)
                    setJobSites(response.data)
                }
        }).catch((error) => handleError(error.message))
    }, [])

    useEffect(() => {
        setDateError(new Date() < new Date(reportDate))
        setWeatherRequired(new Date(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'})) > new Date(reportDate))
    }, [reportDate])

    const submitReport = (data) => {
        const handleError = (message) => setError('An error occurred submitting the report.\n' + message)
        axios.post(config.newJobReport, {
            jobID: selectedJobSite,
            reportDate: data.reportDate,
            weather: data.weather,
            crewSize: data.crewSize,
            visitors: data.visitors,
            workArea1: data.workArea1,
            workArea2: data.workArea2,
            workArea3: data.workArea3,
            workArea4: data.workArea4,
            workArea5: data.workArea5,
            materials1: data.materials1,
            materials2: data.materials2,
            materials3: data.materials3,
            materials4: data.materials4,
            subs: data.subs,
            onsite: data.onsite
        }).then((response) => {
            setLoading(false)
            if (response.status === 200)
                if (response.headers.has('X-Amz-Function-Error')) handleError(response.headers.get('X-Amz-Function-Error'))
                else {
                    setError(false)
                    window.location.href = '/success.html'
                }
        }).catch((error) => {
            console.log(error)
            handleError( error.message)
            setLoading(false)
        })
    }

  return (
    <div className="App">
        <Sheet variant="soft" sx={{px: 10, py: 5, height: '100%'}}>
            {error && <Alert color="danger" size="lg" variant="solid">
                {error}
            </Alert>}
            <Typography color="primary" level="h2" sx={{my: 3}}>
                Daily Job Report
            </Typography>
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
                    subs: formElements.subs.value,
                    onsite: formElements.onsite.checked
                }
                submitReport(data)
            }}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Project Address</FormLabel>
                        <Select required placeholder="Choose one…" value={selectedJobSite} onChange={(event, newValue) => {console.log(newValue); setSelectedJobSite(newValue)}}>
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
                        <Input required={isWeatherRequired} placeholder={isWeatherRequired ? "Required" : "Optional"} name="weather" onChange={(e) => setWeather(e.target.value)}/>
                        {isWeatherRequired && <FormHelperText color="primary">Weather info is required when submitting past reports.</FormHelperText>}
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
                    <Checkbox sx={{textAlign: 'left'}} label="On-site?" name="onsite"/>
                    <Button type="submit" loading={loading}>Submit</Button>
                </Stack>
            </form>
        </Sheet>
    </div>
  );
}

export default App;
