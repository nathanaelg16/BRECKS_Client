'use client'

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {IconButton, Option, Select, Sheet, Stack} from "@mui/joy";
import {JOB_STATUS} from "@/app/utils";
import {useContext, useRef, useState} from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {CheckCircleOutline, CloseRounded, KeyboardArrowDown} from "@mui/icons-material";
import {postman} from "@/resources/config";
import {JobContext} from "@/app/(app)/job/[id]/job_context";

export default function JobViewStatusChanger({sx}) {
    const [job, updateJob] = useContext(JobContext)
    const action = useRef(null)
    const [loading, setLoading] = useState(false)
    const [successGlyph, setSuccessGlyph] = useState(false)

    const [selectedStatus, setSelectedStatus] = useState(null)
    const [statusError, setStatusError] = useState(false)
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    })

    const updateStatus = () => {
        if (selectedStatus === null || JOB_STATUS[selectedStatus] === undefined) setStatusError(true)
        else setStatusError(false)

        setLoading(true)

        postman.post(`/jobs/${job.id}/status/change`, {
            status: JOB_STATUS[selectedStatus],
            startDate: dateRange.from,
            endDate: dateRange.to
        }).then((response) => {
            if (response.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    setSuccessGlyph(true)
                    setTimeout(() => {
                        setSuccessGlyph(false)
                        updateJob()
                    }, 1000)
                }, 1500)
            } else {
                // todo perform error handling
            }
        }).catch((error) => {
            // todo error handling
            setLoading(false)
        })
    }

    return <form onSubmit={(e) => {
        e.preventDefault()
        updateStatus()
    }}>
        <Sheet variant='soft' sx={{...sx, p: 1, borderRadius: '15px'}}>
            <Stack spacing={2} sx={{}}>
                <FormControl error={statusError}>
                    <FormLabel sx={{fontWeight: '600', fontSize: '16px'}}>Update status</FormLabel>
                    <Select action={action} required value={selectedStatus} indicator={<KeyboardArrowDown />} placeholder='Select...' onChange={(ev, nv) => setSelectedStatus(nv)} {...(selectedStatus && {
                        // display the button and remove select indicator
                        // when user has selected a value
                        endDecorator: (
                            <IconButton
                                size='xs'
                                variant="plain"
                                color="neutral"
                                onMouseDown={(event) => {
                                    // don't open the popup when clicking on this button
                                    event.stopPropagation();
                                }}
                                onClick={() => {
                                    setSelectedStatus(null);
                                    action.current?.focusVisible();
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        ),
                        indicator: null,
                    })}>
                        {Object.entries(JOB_STATUS).map(([k, v], i) => <Option key={i} value={k}>{v}</Option>)}
                    </Select>
                </FormControl>
                <Stack direction='row' spacing={2}>
                    <FormControl required>
                        <FormLabel sx={{fontWeight: '600', fontSize: '16px'}}>Start date</FormLabel>
                        <Input required type="date" value={dateRange.from} slotProps={{input: {max: new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'})}}}
                               onChange={(e) => setDateRange({...dateRange, from: e.target.value})}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel sx={{fontWeight: '600', fontSize: '16px'}}>End date</FormLabel>
                        <Input type="date" value={dateRange.to}
                               onChange={(e) => setDateRange({...dateRange, to: e.target.value})}/>
                    </FormControl>
                </Stack>
                <Button loading={loading} type='submit'>{successGlyph ? <CheckCircleOutline /> : 'Update'}</Button>
            </Stack>
        </Sheet>
    </form>
}
