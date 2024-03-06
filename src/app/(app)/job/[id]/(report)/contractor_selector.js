import {Divider, IconButton, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import AddIcon from "@mui/icons-material/Add";
import Popper from "@/app/(components)/(popper)/popper";
import {useCallback, useEffect, useState} from "react";
import {postman} from "@/resources/config";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['500', '800']})

export default function ContractorSelector({onSelect, sx, anchor, onClose, crew}) {
    const [contractors, setContractors] = useState([])
    const [input, setInput] = useState('')
    const onCloseCapture = useCallback(() => {
        setInput('')
        onClose()
    }, [onClose])

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

    return <Popper open={Boolean(anchor)} anchor={anchor} onClose={onCloseCapture} sx={{...sx}}>
        <Stack sx={{overflowY: 'scroll'}} justifyContent='center'>
            <Typography textAlign='center' sx={{color: 'black'}} className={RedHatFont.className} fontWeight='600' fontSize='sm'>Contractors</Typography>
            <Divider sx={{'--Divider-lineColor': 'black'}} />
            {contractors.filter((contractor) => !crew.has(contractor.shortName)).map((contractor) => <Button key={contractor} className={RedHatFont.className} variant='plaint' sx={{width: 1, mt: 1, background: 'var(--joy-palette-primary-100)', '&:hover': {background: 'var(--joy-palette-primary-200)'}}} onClick={() => onSelect(contractor.shortName)}>{contractor.shortName}</Button>)}
            <Stack direction='row' spacing={1} justifyContent='space-around' sx={{mt: 1, border: '2px solid #8DBAD8', borderRadius: 10, '&:hover': {color: 'black', borderColor: '#78BDE8'}}}>
                <Input onChange={(e) => setInput(e.target.value)} color='neutral' className={RedHatFont.className} placeholder='Add new...' value={input} variant='plain' sx={{width: 1, mt: 1, color: '#202020', background: 'transparent', '&:hover': {color: 'black'}, '--Input-focusedThickness': 0}}/>
                <IconButton disabled={!Boolean(input) || crew.has(input)} onClick={() => {
                    onSelect(input)
                    setInput('')
                }} sx={{background: '#8DBAD8', color: '#000000', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, '&:hover': {background: '#78BDE8'}, '&:disabled': {background: '#9B9DAA', border: '2px solid #9B9DAA', my: '-2px', mr: '-2px'}}}><AddIcon sx={{color: 'black'}} /></IconButton>
            </Stack>
        </Stack>
    </Popper>
}
