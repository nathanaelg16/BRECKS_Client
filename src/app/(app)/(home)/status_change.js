import {Modal, ModalDialog, Option, Select, Stack} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {useState} from "react";
import {JOB_STATUS} from "@/app/utils";
import Button from "@mui/joy/Button";
import {postman} from "@/resources/config";
import {CheckCircleOutline} from "@mui/icons-material";
import {useRouter} from "next/navigation";

export default function StatusChange({openState, job}) {
    const router = useRouter()
    const [open, setOpen] = openState
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleString("en-CA", {timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric'}))
    const [statusError, setStatusError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [successGlyph, setSuccessGlyph] = useState(false)

    const changeStatus = () => {
        if (selectedStatus === null || JOB_STATUS[selectedStatus] === undefined) setStatusError(true)
        else setStatusError(false)

        setLoading(false)

        const token = sessionStorage.getItem('token')

        postman.post(`/jobs/${job.id}/status/change`, {
            status: JOB_STATUS[selectedStatus],
            startDate: effectiveDate
        }, {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setLoading(false)
                setSuccessGlyph(true)
                setTimeout(() => {
                    setSuccessGlyph(false)
                    setOpen(false)
                    router.refresh()
                }, 1000)
            } else {
                // todo perform error handling
            }
        }).catch((error) => {
            // todo error handling
        }).finally(() => setLoading(false))
    }

    return <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
            <ModalClose/>
            <form onSubmit={(e) => {
                e.preventDefault()
                changeStatus()
            }}>
                <Stack spacing={2}>
                    <Box sx={{display: 'flex'}}>
                        <Typography level='title-lg' sx={{mx: 'auto'}}>{job.address}</Typography>
                    </Box>
                    <FormControl required error={statusError}>
                        <FormLabel>New status</FormLabel>
                        <Select value={selectedStatus} placeholder='Select...' onChange={(ev, nv) => setSelectedStatus(nv)}>
                            {Object.entries(JOB_STATUS).map(([k, v], i) => <Option key={i} value={k}>{v}</Option>)}
                        </Select>
                    </FormControl>
                    <FormControl required>
                        <FormLabel>Effective date</FormLabel>
                        <Input required type="date" value={effectiveDate}
                               onChange={(e) => setEffectiveDate(e.target.value)}/>
                    </FormControl>
                    <Button loading={loading} type='submit'>{successGlyph ? <CheckCircleOutline /> : "Change"}</Button>
                </Stack>
            </form>
        </ModalDialog>
    </Modal>
}
