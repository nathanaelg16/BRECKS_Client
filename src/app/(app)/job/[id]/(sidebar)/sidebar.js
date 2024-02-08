import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Chip} from "@mui/joy";
import {Red_Hat_Display} from "next/font/google";
import JobViewStatusChanger from "@/app/(app)/job/[id]/(sidebar)/status_change";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function Sidebar({sx, job}) {
    return <Box sx={{...sx, borderLeft: '2px solid gray', px: 1, pt: 2, display: 'flex', flexDirection: 'column', background: 'var(--joy-palette-neutral-50)'}}>
        <Box sx={{mx: 'auto', textAlign: 'center'}}>
            <Typography className={RedHatFont.className} level={'h2'}>{job.address}</Typography>
            {!!job.identifier && <Typography className={RedHatFont.className} level={'h3'}>({job.identifier})</Typography>}
        </Box>
        <Chip color='primary' sx={{mx: 'auto', mt: 2}}>
            <Typography className={RedHatFont.className} fontWeight='800' level='title' fontSize='lg'>{job.status}</Typography>
        </Chip>
        <JobViewStatusChanger sx={{mt: 3}} />
    </Box>
}
