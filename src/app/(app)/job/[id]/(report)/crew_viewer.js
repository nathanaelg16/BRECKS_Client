'use client'

import {useEffect, useState} from "react";
import {Divider, Stack} from "@mui/joy";
import {Red_Hat_Display} from "next/font/google";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import EditableComponent from "@/app/(app)/job/[id]/(report)/editable_component";
import CloseIcon from "@mui/icons-material/Close";
import Tool from "@/app/(app)/job/[id]/(report)/(tools)/tool";
import AddIcon from "@mui/icons-material/Add";
import ContractorSelector from "@/app/(app)/job/[id]/(report)/contractor_selector";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['500', '800']})

export default function CrewViewer({withCrew, editing}) {
    const [crew, setCrew] = withCrew
    const [anchor, setAnchor] = useState(null)

    useEffect(() => {
        return () => {
            setAnchor(null)
        }
    }, [])

    const renderInputComponents = (contractor) => function renderComponent(props) {
        return <Input startDecorator={<Typography sx={{color: '#333333'}} className={RedHatFont.className} fontWeight='800'>{contractor}:</Typography>}
                      variant='plain'
                      sx={{borderRadius: '20px', '.Mui-disabled': {color: 'black'}, color: 'black'}}
                      {...props}
                      className={`${RedHatFont.className} ${props.className} crewInput`}
                      endDecorator={<Stack direction='row' useFlexGap justifyContent='flex-end' alignItems='center'>
                          {props.endDecorator}
                          {!props.disabled && <Tool name='Remove' icon={<CloseIcon />} onClick={props.onDelete} sx={{'--IconButton-size': '28px', background: 'transparent', '&:hover': {background: 'transparent', color: 'var(--joy-palette-danger-500)'}}} props={{variant: 'plain'}}  />}
                        </Stack>}
        />
    }

    const renderOuterComponent = (props) => {
        const handleClick = (event) => {
            setAnchor(anchor ? null : event.currentTarget)
        }

        const tool = <Tool props={{variant: 'outlined'}} name='Add' icon={<AddIcon />} onClick={handleClick} sx={{background: 'transparent', '&:hover': {background: 'var(--joy-palette-primary-100)', color: 'black'}}}/>

        return <Stack spacing={editing ? 1 : 0} sx={{width: 1, padding: 1}} className={`${props.className} editableComponentContainer crewStack`}>
            {props.value?.entrySeq().map(([contractor, crewSize], index) => <EditableComponent key={contractor} renderComponent={renderInputComponents(contractor)} value={crewSize} editing={editing} onEdit={(newValue) => {
                let newValueInt = newValue ? parseInt(newValue) : 0
                if (!isNaN(newValueInt)) setCrew(crew.set(contractor, newValueInt))
            }} onDelete={() => setCrew(crew.remove(contractor))} />)}
            {editing && <>
                <Divider sx={{pt: 1}}>{tool}</Divider>
                <ContractorSelector crew={crew} anchor={anchor} onClose={() => setAnchor(null)} onSelect={(selection) => {
                    setCrew(crew.set(selection, 0))
                    setAnchor(null)
                }} />
            </>}
            <Stack direction='row' justifyContent='flex-end' alignItems='center'>
                {props.endDecorator}
            </Stack>
        </Stack>
    }

    return <EditableComponent renderComponent={renderOuterComponent} value={crew} onEdit={(value) => setCrew(value)} editing={editing} />
}
