import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import {Divider} from "@mui/joy";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from "@mui/joy/Button";

export default function WorkDescriptions({descriptions}) {
    const {Range} = require('immutable')
    const [workDescriptions, setWorkDescriptions] = descriptions;

    const descriptionField = (i) => <FormControl required>
        <Input key={i} placeholder="Type/Location/Drawing/Elevation/Facade"/>
    </FormControl>

    return <>
        <Typography level="title-md">
            Work Taking Place On-site
        </Typography>
        {descriptionField()}
        {Range(1, workDescriptions.size).values().map((i) => descriptionField(i))}
        <Divider><Button variant='outline' onClick={() => setWorkDescriptions(workDescriptions.push(''))}><AddCircleOutlineIcon color='success'/></Button></Divider>
    </>
}
