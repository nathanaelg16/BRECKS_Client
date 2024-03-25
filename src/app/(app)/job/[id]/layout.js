'use client'

import {JobContext} from "@/app/(app)/job/[id]/job_context"
import {useCallback, useContext, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {SnackbarContext} from "@/app/(app)/context";

export default function JobLayout({params, children}) {
    const setSnackbar = useContext(SnackbarContext)
    const [job, setJob] = useState({})

    const updateJob = useCallback(() => {
        postman.get(`/jobs/${params.id}`)
            .then((response) => {
                setJob(response.data)
            }).catch((error) => {
                if (error.response?.status === 404) setSnackbar('error', {text: '404 - Job site not found', vertical: 'top', horizontal: 'center'})
                else setSnackbar('error', {text: 'An unexpected error occurred retrieving job information from the database.', vertical: 'top', horizontal: 'center'})
            })
    }, [params.id, setJob, setSnackbar])

    useEffect(() => {
        updateJob()
    }, [updateJob, params.id])

    return <JobContext.Provider value={[job, updateJob]}>
        {children}
    </JobContext.Provider>
}
