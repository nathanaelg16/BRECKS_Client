import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Option, Select, Sheet, Stack} from "@mui/joy";
import {JOB_STATUS} from "@/app/utils";
import {useState} from "react";

export default function JobViewStatusChanger({sx}) {
    const [selectedStatus, setSelectedStatus] = useState(null)

    return <form>
        <Sheet variant='soft' sx={{...sx, p: 1, borderRadius: '15px'}}>
            <Stack id='statusChange' spacing={2} sx={{}}>
                <FormControl>
                    <FormLabel sx={{fontWeight: '600', fontSize: '16px'}}>Change status</FormLabel>
                    <Select required value={selectedStatus} placeholder='Select...' onChange={(ev, nv) => setSelectedStatus(nv)}>
                        {Object.entries(JOB_STATUS).map(([k, v], i) => <Option key={i} value={k}>{v}</Option>)}
                    </Select>
                </FormControl>
            </Stack>
        </Sheet>
    </form>
}
