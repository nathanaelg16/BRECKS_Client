'use client'

import {JobContext} from "@/app/(app)/job/[id]/job_context"
import {useCallback, useEffect, useState} from "react";
import {postman} from "@/resources/config";

export default function JobLayout({params, children}) {
    const [job, setJob] = useState({})

    const updateJob = useCallback(() => {
        postman.get(`/jobs/${params.id}`)
            .then((response) => {
                if (response.status === 200) setJob(response.data)
                else {
                    // todo error handling
                }
            }).catch((error) => {
            // todo implement error handling
        })
    }, [params.id, setJob])

    useEffect(() => {
        updateJob()
    }, [updateJob, params.id])

    return <JobContext.Provider value={[job, updateJob]}>
        {children}
    </JobContext.Provider>
}
