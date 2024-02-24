import {Grid, Modal, ModalDialog} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import {Red_Hat_Display} from "next/font/google";
import {useContext, useEffect, useState} from "react";
import {JobContext} from "@/app/(app)/job/[id]/job_context";

const {Map} = require('immutable')
const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function ReportViewer({showReportState, activeReport}) {
    const [showReport, setShowReport] = showReportState
    const [job, _] = useContext(JobContext)
    const [weather, setWeather] = useState('')
    const [visitors, setVisitors] = useState('')
    const [crew, setCrew] = useState(Map())
    const [workDescriptions, setWorkDescriptions] = useState([''])
    const [materials, setMaterials] = useState([''])

    useEffect(() => {
        setWeather(activeReport?.weather)
        setVisitors(activeReport?.visitors)
        setCrew(Map(activeReport.crew))
        setWorkDescriptions(activeReport?.workDescriptions)
        setMaterials(activeReport?.materials)
    }, [activeReport])

    const createDatum = (key, value) => <Grid sx={{borderBottom: '1px solid black'}} xs={12}>
        <Box sx={{display: 'grid', gridAutoRows: 'auto', gridTemplateColumns: '1fr 1fr', width: 1, gap: 2, alignItems: 'center'}}>
            <Typography className={RedHatFont.className} sx={{gridRow: 1, gridColumn: 1}} textAlign='right' level='title-lg'>
                {key}
            </Typography>
            <Box className={RedHatFont.className} sx={{display: 'contents', gridRow: 1, gridColumn: 2}}>
                {value}
            </Box>
        </Box>
    </Grid>

    const createInputDatum = (key, value) => createDatum(key, <Input slotProps={{input: {style: {textAlign: 'center'}}}} fullWidth variant='plain' size='md' className={RedHatFont.className} value={value} />)
    const createTextDatum = (key, value) => createDatum(key, <Typography className={RedHatFont.className} textAlign='center' level='body-lg'>{value}</Typography>)

    return <Modal open={showReport} onClose={() => setShowReport(false)}>
        <ModalDialog sx={{width: 0.5}}>
            <ModalClose />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1, width: 0.5, mx: 'auto', border: '1px solid black' }} alignItems='center'>
                    <Grid sx={{borderBottom: '1px solid black'}} xs={12}>
                        <Typography className={RedHatFont.className} textAlign='center' level='h1'>{job.address}</Typography>
                        <Typography className={RedHatFont.className} textAlign='center' level='h3'>Job Report</Typography>
                    </Grid>
                    {createTextDatum('Report Date', activeReport.reportDate)}
                    {createInputDatum('Weather', weather)}
                    {createInputDatum('Visitors', visitors)}
                    {createTextDatum('Submitted by', activeReport.reportBy?.fullName)}
                </Grid>
            </Box>
        </ModalDialog>
    </Modal>
}
