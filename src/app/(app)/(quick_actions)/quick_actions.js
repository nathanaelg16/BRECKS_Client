import {useState} from "react";
import NewJobForm from "@/app/(app)/(quick_actions)/new_job_form";
import {DialogContent, Drawer} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ConstructionIcon from "@mui/icons-material/Construction";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Box from "@mui/joy/Box";
import NewContractorForm from "@/app/(app)/(quick_actions)/new_contractor_form";
import "./quick_actions.css"
import ModalClose from "@mui/joy/ModalClose";

function Action({title, props}) {
    return <Button className='actionButton' component='a' href='#action' variant="outlined" size="lg" sx={{width: 1, py: 2, height: '75px'}} {...props}>
        <Typography color="primary" level="h4">{title}</Typography>
    </Button>
}

export default function QuickActions(props) {
    const [action, setAction] = useState('')

    const onClose = () => {
        setAction('')
        props.onClose()
    }

    let actionComponent = <></>

    if (action === 'new_job') actionComponent = <NewJobForm onClose={onClose} />
    else if (action === 'new_contractor') actionComponent = <NewContractorForm onClose={onClose} />

    return <Drawer open={props.open} anchor={"left"} onClose={onClose} sx={{'--Drawer-horizontalSize': {md: 'clamp(300px, 30%, 100%)', sm: 'clamp(300px, 50%, 100%)', xs: '100%'}}}>
        <DialogContent id='quick-actions' sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 5, px: 2, py: 10, overflowY: 'auto'}}>
            <ModalClose variant='soft' size='lg' sx={{'--Icon-fontSize': '32px', background: 'var(--joy-palette-neutral-600)', '--Icon-color': '#F3F3F3'}}/>
            <Typography variant="soft" level="h2" sx={{width: 1, py: 2, userSelect: 'none', height: '75px'}} textAlign="center">
                Quick Actions
            </Typography>
            <Action title='Submit a new report' props={{href: "/report", endDecorator: <AssignmentIcon/>}} />
            <Action title='Create a new job' props={{onClick: () => setAction('new_job'), endDecorator: <ConstructionIcon/>}} />
            <Action title='Register a new contractor' props={{onClick: () => setAction('new_contractor'), endDecorator: <EngineeringIcon />}} />
            {Boolean(action) &&
                <Box id='action' sx={{width: 1, border: '1px solid var(--joy-palette-neutral-600)', borderRadius: 8, p: 1}}>
                    {actionComponent}
                </Box>}
        </DialogContent>
    </Drawer>
}
