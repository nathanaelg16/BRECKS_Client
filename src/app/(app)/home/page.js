'use client'

import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/joy";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import JobAccordion from "@/app/(app)/home/job_accordion";
import SentimentVeryDissatisfiedSharpIcon from '@mui/icons-material/SentimentVeryDissatisfiedSharp';
import Box from "@mui/joy/Box";

export default function Home() {
  const [allJobs, setAllJobs] = useState({})
  const [error, setError] = useState(false)

  const categorize = (jobs) => {
    return {
      active: jobs.filter((job) => job.status === 'ACTIVE'),
      onHold: jobs.filter((job) => job.status === 'ON_HOLD'),
      completed: jobs.filter((job) => job.status === 'COMPLETED'),
      notStarted: jobs.filter((job) => job.status === 'NOT_STARTED')
    }
  }

  useEffect(() => {
    postman.get('/jobs').then((response) => {
      if (response.status === 200) setAllJobs(categorize(response.data))
      else throw new Error()
    }).catch(() => setError(true))
  }, [])

  const onError = <Stack justifyContent='center' alignItems='center' spacing={2} sx={{height: 1}}>
    <SentimentVeryDissatisfiedSharpIcon color='primary' sx={{fontSize: 48}} />
    <Typography level='h3' color='primary' textAlign='center'>An error occurred accessing the application. Please try again later.</Typography>
  </Stack>

  const home = <Box id={'all_jobs'} sx={{px: 2}}>
    <JobAccordion jobs={allJobs} />
  </Box>

  return <Stack sx={{width: 1, height: 1}}>
    <Typography level={'h1'} sx={{m: 2, color: 'var(--joy-palette-primary-800)'}}>Dashboard</Typography>
    {error ? onError : home}
  </Stack>
}
