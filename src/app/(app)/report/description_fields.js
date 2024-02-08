import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import {Divider} from "@mui/joy";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from "@mui/joy/Button";
import ClearIcon from '@mui/icons-material/Clear';
import {useEffect, useState} from "react";

export default function DescriptionFields({descriptions, title, placeholder, required}) {
    const {Range} = require('immutable')
    const [desc, setDesc] = descriptions;
    const [addDescriptionDisabled, setAddDescriptionDisabled] = useState(true)

    useEffect(() => {
        setAddDescriptionDisabled(desc.get(desc.size - 1) === '')
    }, [desc]);

    const descriptionField = (i) => <FormControl key={i} required={required}>
        <Input placeholder={placeholder} endDecorator={i === 0 ? null :
            <Button variant='outline' onClick={() => setDesc(desc.delete(i))}>
                <ClearIcon sx={{'&:hover': {color: 'var(--joy-palette-danger-700)'}}} color='danger'/>
            </Button>}
               onChange={(e) => setDesc(desc.set(i, e.target.value))}
               value={desc.get(i)}
        />
    </FormControl>

    return <>
        <Divider/>
        <Typography level="title-md">
            {title}
        </Typography>
        {descriptionField(0)}
        {Range(1, desc.size).map((i) => descriptionField(i))}
        <Divider>
            <Button disabled={addDescriptionDisabled} variant='outline'
                         onClick={() => setDesc(desc.push(''))}>
                <AddCircleOutlineIcon color={addDescriptionDisabled ? 'neutral' : 'success'}/>
            </Button>
        </Divider>
        {/* todo add images feature */}
    </>
}
