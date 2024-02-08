import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Option, Select, Sheet, Stack} from "@mui/joy";
import {JOB_STATUS} from "@/app/utils";
import {useState} from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

export default function JobViewStatusChanger({sx}) {
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    })

    return <form>
        <Sheet variant='soft' sx={{...sx, p: 1, borderRadius: '15px'}}>
            <Stack spacing={2} sx={{}}>
                <FormControl>
                    <FormLabel sx={{fontWeight: '600', fontSize: '16px'}}>Update status</FormLabel>
                    <Select required value={selectedStatus} placeholder='Select...' onChange={(ev, nv) => setSelectedStatus(nv)}>
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
                <Button>Update</Button>
            </Stack>
        </Sheet>
    </form>
}
