'use client'

import {useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import {Chip, ChipDelete, IconButton, Stack} from "@mui/joy";
import {postman} from "@/resources/config";
import {Red_Hat_Display} from "next/font/google";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Input from "@mui/joy/Input";
import {ClickAwayListener, Popper} from "@mui/base";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['500', '800']})

export default function CrewViewer({withCrew}) {
    const [crew, setCrew] = withCrew
    const [contractors, setContractors] = useState([])
    const [popperOpen, setPopperOpen] = useState(null)
    const [anchor, setAnchor] = useState(null)

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

    const contractorChip = (contractor, crewSize) => <ClickAwayListener onClickAway={() => setAnchor(null)}>
        <Box key={contractor} sx={{display: 'contents'}}>
            <Chip sx={{cursor: 'pointer'}}
                  size='md'
                  endDecorator={<ChipDelete sx={{'&:hover': {background: 'var(--joy-palette-danger-200)'}}} onDelete={() => setCrew(crew.delete(contractor))} />}
                  onClick={(e) => {
                      setAnchor(e.currentTarget)
                      setPopperOpen(contractor)
                  }}
            >
                <strong>{contractor}:</strong> {crewSize}
            </Chip>
            <Popper open={!!anchor && !!popperOpen && popperOpen === contractor} anchorEl={anchor}>
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={() => setCrew(crew.set(contractor, crewSize + 1))}>
                        <AddIcon />
                    </IconButton>
                    <Input value={!!crewSize ? crewSize : 0} onKeyDown={(e) => {
                        let key = e.key
                        if (isNaN(key) || key.length !== 1) e.preventDefault()
                    }} onChange={(e) => {
                        let val = parseInt(e.target.value)
                        setCrew(crew.set(contractor, isNaN(val) ? 0 : val))
                    }}/>
                    <IconButton onClick={() => setCrew(crew.set(contractor, crewSize - 1))}>
                        <RemoveIcon />
                    </IconButton>
                </Stack>
            </Popper>
        </Box>
    </ClickAwayListener>

    return <Stack spacing={2} sx={{p: 1}}>
        <Stack spacing={1} direction='row' flexWrap='wrap' useFlexGap justifyContent='center' alignItems='center'>
            {crew.entrySeq().map(([contractor, crewSize]) => contractorChip(contractor, crewSize))}
        </Stack>
    </Stack>
}
