'use client'

import {useEffect, useState} from "react";
import {Stack} from "@mui/joy";
import {postman} from "@/resources/config";
import {Red_Hat_Display} from "next/font/google";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import EditableComponent from "@/app/(app)/job/[id]/(report)/editable_component";

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

    const renderComponentFn = (contractor) => function renderComponent(props) {
        return <Input className={RedHatFont.className}
                      startDecorator={<Typography sx={{color: '#333333'}} className={RedHatFont.className} fontWeight='800'>{contractor}:</Typography>}
                      variant='plain'
                      sx={{borderRadius: '20px', '.Mui-disabled': {color: 'black'}, color: 'black'}}
                      {...props}
        />
    }

    return <Stack spacing={editing ? 1 : 0} sx={{width: 1}}>
        {crew.entrySeq().map(([contractor, crewSize], index) => <EditableComponent key={contractor} renderComponent={renderComponentFn(contractor)} value={crewSize} editing={editing} onEdit={(newValue) => {
            let newValueInt = newValue ? parseInt(newValue) : 0
            if (!isNaN(newValueInt)) setCrew(crew.set(contractor, newValueInt))
        }} />)}
    </Stack>
}
