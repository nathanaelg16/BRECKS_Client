import {Sheet} from "@mui/joy";
import JobCard from "@/app/(app)/home/job_card";

export default function JobScrollView({jobs}) {
    return <Sheet className='jobScrollView' sx={{background: (theme) => {theme.palette.primary["50"]}, overflowX: {md: 'scroll', xs: 'unset'}, overflowY: {md: 'unset', xs: 'scroll'}, display: 'flex', gap: 3, p: 2, flexDirection: {sm: 'row', xs: 'column'}}}>
        {jobs.map((job) => <JobCard key={job.id} job={job}/>)}
    </Sheet>
}
