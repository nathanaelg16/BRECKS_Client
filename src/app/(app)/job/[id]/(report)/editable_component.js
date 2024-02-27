'use client'

import {useEffect, useRef, useState} from "react";
import Typography from "@mui/joy/Typography";
import {Red_Hat_Display} from "next/font/google";
import {Stack} from "@mui/joy";
import RestoreIcon from "@mui/icons-material/Restore";
import Tool from "@/app/(app)/job/[id]/(report)/(tools)/tool";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['400']})

export default function EditableComponent({value, onEdit, editing, renderComponent}) {
    const initialValueRef = useRef(value)
    const editingRef = useRef(editing)
    const [variant, setVariant] = useState('plain')
    const [edited, setEdited] = useState(false)

    useEffect(() => {
        if (editing && !editingRef.current) {
            editingRef.current = true
            initialValueRef.current = value
        }

        if (!editing && editingRef.current) {
            editingRef.current = false
            initialValueRef.current = value
        }

        setVariant(editing ? 'outlined' : 'plain')
        setEdited(editing && value !== initialValueRef.current)
    }, [editing, value])

    const endDecorator = edited ? <Stack sx={{ml: 'auto'}} direction='row' spacing={0.5} justifyContent='flex-end' alignItems='center'>
        <Typography fontWeight='400' level='body-sm' className={RedHatFont.className}>(edited)</Typography>
        <Tool name='Revert' icon={<RestoreIcon />} onClick={() => onEdit(initialValueRef.current)} sx={{'--IconButton-size': '28px', background: 'transparent', '&:hover': {background: 'transparent'}}} props={{variant: 'plain'}}  />
    </Stack> : null

    return renderComponent({disabled: !editing, variant, endDecorator, onChange: (e) => onEdit(e.target.value), value})
}
