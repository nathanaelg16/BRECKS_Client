import {Sheet} from "@mui/joy";
import JobCard from "@/app/(app)/home/job_card";

export default function JobScrollView({jobs}) {
    return <Sheet sx={{background: (theme) => {theme.palette.primary["50"]}, overflowX: 'scroll', display: 'flex', gap: 3, p: 2}}>
        {jobs.map((job) => <JobCard key={job.id} job={job}/>)}
    </Sheet>
}
