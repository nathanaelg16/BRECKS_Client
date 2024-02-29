'use client'

import {useEffect, useState} from "react";
import {Stack} from "@mui/joy";
import {postman} from "@/resources/config";
import {Red_Hat_Display} from "next/font/google";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import EditableComponent from "@/app/(app)/job/[id]/(report)/editable_component";
import CloseIcon from "@mui/icons-material/Close";
import Tool from "@/app/(app)/job/[id]/(report)/(tools)/tool";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['500', '800']})

export default function CrewViewer({withCrew, editing}) {
    const [crew, setCrew] = withCrew
    const [contractors, setContractors] = useState([])

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        postman.get('/contractors', {
            headers: {
                Authorization: 'BearerJWT ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                setContractors(response.data.sort((a, b) => a.shortName.localeCompare(b.shortName)))
            }
        }).catch((error) => {
            // todo implement error handling
            console.log(error)
        })
    }, [])

    const renderInputComponents = (contractor) => function renderComponent(props) {
        return <Input className={RedHatFont.className}
                      startDecorator={<Typography sx={{color: '#333333'}} className={RedHatFont.className} fontWeight='800'>{contractor}:</Typography>}
                      variant='plain'
                      sx={{borderRadius: '20px', '.Mui-disabled': {color: 'black'}, color: 'black'}}
                      {...props}
                      endDecorator={<Stack direction='row' useFlexGap justifyContent='flex-end' alignItems='center'>
                          {props.endDecorator}
                          {!props.disabled && <Tool name='Remove' icon={<CloseIcon />} onClick={props.onDelete} sx={{'--IconButton-size': '28px', background: 'transparent', '&:hover': {background: 'transparent', color: 'var(--joy-palette-danger-500)'}}} props={{variant: 'plain'}}  />}
                        </Stack>}
        />
    }

    const renderOuterComponent = (props) => {
        return <Stack spacing={editing ? 1 : 0} sx={{width: 1, padding: 1}} className={`${props.className} editableComponentContainer`}>
            {props.value?.entrySeq().map(([contractor, crewSize], index) => <EditableComponent key={contractor} renderComponent={renderInputComponents(contractor)} value={crewSize} editing={editing} onEdit={(newValue) => {
                let newValueInt = newValue ? parseInt(newValue) : 0
                if (!isNaN(newValueInt)) setCrew(crew.set(contractor, newValueInt))
            }} onDelete={() => setCrew(crew.remove(contractor))} />)}
            <Stack direction='row' justifyContent='flex-end' alignItems='center'>
                {props.endDecorator}
            </Stack>
        </Stack>
    }

    return <EditableComponent renderComponent={renderOuterComponent} value={crew} onEdit={(value) => setCrew(value)} editing={editing} />
}
