import {useState} from "react";
import NewJobForm from "@/app/(app)/(quick_actions)/NewJobForm";
import {DialogContent, Drawer} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ConstructionIcon from "@mui/icons-material/Construction";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Box from "@mui/joy/Box";
import NewContractorForm from "@/app/(app)/(quick_actions)/NewContractorForm";

export default function QuickActions(props) {
    const [action, setAction] = useState('')

    const onClose = () => {
        setAction('')
        props.onClose()
    }

    let actionComponent = <></>

    if (action === 'new_job') actionComponent = <NewJobForm onClose={onClose} />
    else if (action === 'new_contractor') actionComponent = <NewContractorForm onClose={onClose} />

    return <Drawer open={props.open} anchor={"left"} onClose={onClose}>
        <DialogContent
            sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 5, px: 2, mt: 10}}>
            <Typography variant="soft" level="h2" sx={{width: 1, py: 2, userSelect: 'none'}} textAlign="center">
                Quick Actions
            </Typography>
            <Button component="a" href="/report" variant="outlined" size="lg" sx={{width: 1, py: 2}}
                    endDecorator={<AssignmentIcon/>}>
                <Typography color="primary" level="h4">
                    Submit a new report
                </Typography>
            </Button>
            <Button onClick={() => setAction('new_job')} variant="outlined" size="lg" sx={{width: 1, py: 2}} endDecorator={<ConstructionIcon/>}>
                <Typography color="primary" level="h4">
                    Create a new job
                </Typography>
            </Button>
            <Button onClick={() => setAction('new_contractor')} variant="outlined" size="lg" sx={{width: 1, py: 2}} endDecorator={<EngineeringIcon />}>
                <Typography color="primary" level="h4">
                    Register a new contractor
                </Typography>
            </Button>
            {Boolean(action) &&
                <Box sx={{width: 1, border: '1px solid var(--joy-palette-neutral-600)', borderRadius: 8, p: 1}}>
                    {actionComponent}
                </Box>}
        </DialogContent>
    </Drawer>
}
