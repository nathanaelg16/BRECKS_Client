'use client'

import Typography from "@mui/joy/Typography";
import {Sheet, Stack} from "@mui/joy";
import {useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {UserContext} from "@/app/(app)/user_context";
import JobAccordion from "@/app/(app)/home/job_accordion";
import SentimentVeryDissatisfiedSharpIcon from '@mui/icons-material/SentimentVeryDissatisfiedSharp';

export default function Home() {
  const user = useContext(UserContext)
  const [userJobs, setUserJobs] = useState({})
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
    postman.get('/jobs?' + new URLSearchParams({teamID: user.teamID})).then((response) => {
      if (response.status === 200) setUserJobs(categorize(response.data.sort((a, b) => a.address.localeCompare(b.address))))
      else throw new Error()
    }).catch(() => setError(true))

    postman.get('/jobs').then((response) => {
      if (response.status === 200) setAllJobs(categorize(response.data))
      else throw new Error()
    }).catch(() => setError(true))
  }, [user])

  const onError = <Stack justifyContent='center' alignItems='center' spacing={2} sx={{height: 1}}>
    <SentimentVeryDissatisfiedSharpIcon color='primary' sx={{fontSize: 48}} />
    <Typography level='h3' color='primary' textAlign='center'>An error occurred accessing the application. Please try again later.</Typography>
  </Stack>

  const home = <Stack spacing={4} sx={{mb: 3}} useFlexGap>
    <Sheet id={'user_jobs'} sx={{p: 2}}>
      <Typography level={'h2'} sx={{mb: 1}}>Your Jobs</Typography>
      <JobAccordion jobs={userJobs} />
    </Sheet>
    <Sheet id={'all_jobs'} sx={{p: 2}}>
      <Typography level={'h2'} sx={{mb: 1}}>All Jobs</Typography>
      <JobAccordion jobs={allJobs} />
    </Sheet>
  </Stack>

  return <Stack sx={{width: 1, height: 1}}>
    <Stack direction='row' justifyContent='space-between'>
      <Typography level={'h1'} sx={{m: 2, color: 'var(--joy-palette-primary-800)'}}>Dashboard</Typography>
    </Stack>
    {error ? onError : home}
  </Stack>
}
