'use client'

import Typography from "@mui/joy/Typography";
import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Sheet} from "@mui/joy";
import {Rubik, Rubik_Dirt} from "next/font/google";
import {useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {UserContext} from "@/app/(app)/user_context";
import JobAccordion from "@/app/(app)/(home)/job_accordion";
import Box from "@mui/joy/Box";

const rubik_dirt = Rubik_Dirt({ weight: '400', subsets: ['latin'] })
const rubik = Rubik({subsets: ['latin']})

export default function Home() {
  const [userJobs, setUserJobs] = useState({})
  const [allJobs, setAllJobs] = useState({})
  const user = useContext(UserContext)

  const categorize = (jobs) => {
    return {
      active: jobs.filter((job) => job.status === 'ACTIVE'),
      onHold: jobs.filter((job) => job.status === 'ON_HOLD'),
      completed: jobs.filter((job) => job.status === 'COMPLETED'),
      notStarted: jobs.filter((job) => job.status === 'NOT_STARTED')
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    postman.get('/jobs?' + new URLSearchParams({teamID: user.teamID}), {
      headers: {
        'Authorization': 'BearerJWT ' + token
      }
    }).then((response) => {
      if (response.status === 200) setUserJobs(categorize(response.data.sort((a, b) => a.address.localeCompare(b.address))))
      else console.log('hmmm')
    }).catch((error) => {
      console.log(error)
      //todo implement error handling
    })

    postman.get('/jobs', {
      headers: {
        'Authorization': 'BearerJWT ' + token
      }
    }).then((response) => {
      if (response.status === 200) setAllJobs(categorize(response.data))
      else console.log('hmmm')
    }).catch((error) => {
      console.log(error)
      //todo implement error handling
    })
  }, [user])

  return <>
    <Typography level={'h1'} sx={{m: 2}}>Dashboard</Typography>
    <Box sx={{my: 3, mb: 0}}>
      <Sheet id={'user_jobs'} sx={{mx: 4, p: 1, mb: 2}}>
        <Typography level={'h2'}>Your Jobs</Typography>
        <JobAccordion jobs={userJobs} />
      </Sheet>
      <Sheet id={'all_jobs'} sx={{mx: 4, p: 1, mt: 4, mb: 2}}>
        <Typography level={'h2'}>All Jobs</Typography>
        <JobAccordion jobs={allJobs} />
      </Sheet>
    </Box>
  </>
}
