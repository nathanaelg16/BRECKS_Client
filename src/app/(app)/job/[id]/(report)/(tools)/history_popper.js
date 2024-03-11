import Popper from "@/app/(components)/(popper)/popper";
import {Divider, List, ListItem, ListItemButton} from "@mui/joy";
import {useCallback, useContext, useEffect, useState} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";
import {postman} from "@/resources/config";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['400', '500', '700'], style: ['normal', 'italic']})
const {DateTime} = require('luxon')

export default function HistoryPopper({withAlert, date, anchor, onClose, onSelection}) {
    const [job, _] = useContext(JobContext)
    const [alert, setAlert] = withAlert
    const [reports, setReports] = useState([])

    const fetchHistory = useCallback(() => {
        const handleError = (error, msg = 'Unable to retrieve report history.') => {
            setReports([])
            onClose()
            setAlert(msg)
        }

        Promise.all([
            postman.get('/reports/history?' + new URLSearchParams({job: job.id, date: date}))
                .then((response) => {
                    if (response.status === 200) return response.data
                    else throw new Error(`HTTP Response: ${response.status}`)
                }),
            postman.get('/reports/summarized?' + new URLSearchParams({job: job.id, startDate: date, endDate: date}))
                .then((response) => {
                    if (response.status === 200) return response.data
                    else throw new Error(`HTTP Response: ${response.status}`)
                })
        ]).then(([reportHistory, currentReport]) => {
            setAlert(false)
            setReports([...currentReport, ...reportHistory])
        }).catch((error) => handleError(error))
    }, [job, date, setAlert, onClose, setReports])

    useEffect(() => {
        if (Boolean(anchor)) fetchHistory()
    }, [fetchHistory, anchor])

    const handleClick = (id, current) => {
        onSelection(id, current)
        onClose()
    }

    const reportItem = (report, index) => <ListItem sx={{width: 1, color: 'white'}} variant='outlined' key={report.id} onClick={() => handleClick(report.id, index === 0)}>
        <ListItemButton>
            <Typography textAlign='center' sx={{color: 'white', width: 1}} fontWeight='700' className={RedHatFont.className}>
                {DateTime.fromSeconds(report.timestamp).toFormat("MM/dd/yy hh:mm:ss a")}
            </Typography>
        </ListItemButton>
    </ListItem>

    return <Popper sx={{background: '#606060', color: 'white'}} open={!Boolean(alert) && Boolean(anchor) && reports.length > 0} anchor={anchor} onClose={onClose}>
            <Typography fontWeight='700' className={RedHatFont.className} textAlign='center' sx={{width: 1, color: 'white'}}>Versions</Typography>

            {reports.length > 0 &&
            <List size='md' sx={{width: 1, borderRadius: 'sm'}}>
                <Divider className={RedHatFont.className} sx={{color: 'white', mb: 1}}>Current</Divider>
                {reportItem(reports[0], 0)}
                <Divider className={RedHatFont.className} sx={{mt: 2, mb: 1, color: 'white'}}>Previous</Divider>
                {reports.slice(1).map((report, index) => reportItem(report, index + 1))}
            </List>}
    </Popper>
}
