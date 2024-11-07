'use client'

import {JobContext} from "@/app/(app)/jobs/job_context"
import {useCallback, useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {SnackbarContext} from "@/app/(app)/context";
import {useRouter, useSearchParams} from "next/navigation";

export default function JobLayout({children}) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const setSnackbar = useContext(SnackbarContext)
    const [job, setJob] = useState({})

    const jobId = searchParams.get('id')
    if (jobId === null) router.push('/home')

    const updateJob = useCallback(() => {
        postman.get(`/jobs/${jobId}`)
            .then((response) => {
                setJob(response.data)
            }).catch((error) => {
                if (error.response?.status === 404) setSnackbar('error', {text: '404 - Job site not found', vertical: 'top', horizontal: 'center'})
                else setSnackbar('error', {text: 'An unexpected error occurred retrieving job information.', vertical: 'top', horizontal: 'center'})
            })
    }, [jobId, setJob, setSnackbar])

    useEffect(() => {
        updateJob()
    }, [updateJob, jobId])

    return <JobContext.Provider value={[job, updateJob]}>
        {children}
    </JobContext.Provider>
}
