'use client'

import {useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import {Chip, ChipDelete, Stack} from "@mui/joy";
import {postman} from "@/resources/config";
import {Red_Hat_Display} from "next/font/google";
import Typography from "@mui/joy/Typography";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['500', '800']})

export default function CrewViewer({value, onChange, disabled, className}) {
    const crew = value
    const [contractors, setContractors] = useState([])
    const editing = !disabled

    const setCrew = (value) => onChange({target: {value: value}})

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

    const contractorChip = (contractor, crewSize) => <Box key={contractor} sx={{display: 'contents'}}>
        <Chip sx={{cursor: editing ? 'pointer' : 'auto'}}
              size='lg'
              endDecorator={editing && <ChipDelete sx={{'&:hover': {background: 'var(--joy-palette-danger-200)'}}} onDelete={() => setCrew(crew.delete(contractor))} />}
        >
            <Typography className={RedHatFont.className} fontWeight='800'>{contractor}: <Typography className={RedHatFont.className} fontWeight='500'>{crewSize}</Typography></Typography>
        </Chip>
    </Box>

    return <Stack className={`${className}`} spacing={2} sx={{p: 1, userSelect: 'none'}}>
        <Stack spacing={1} direction='row' flexWrap='wrap' useFlexGap justifyContent='flex-start' alignItems='center'>
            {crew.entrySeq().map(([contractor, crewSize]) => contractorChip(contractor, crewSize))}
        </Stack>
    </Stack>
}
