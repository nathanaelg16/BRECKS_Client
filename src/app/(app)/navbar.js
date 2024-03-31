'use client'

import Box from "@mui/joy/Box";
import {useState} from "react";
import Button from "@mui/joy/Button";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import {config} from "@/resources/config";
import JobPicker from "@/app/(app)/job_picker";
import {useRouter} from "next/navigation";
import QuickActions from "@/app/(app)/(quick_actions)/quick_actions";
import "./navbar.css"

export default function Navbar() {
    const router = useRouter()
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    return <>
        <QuickActions open={isDrawerOpen} onClose={() => setDrawerOpen(false)}/>
        <Box id='navbar' component='header' sx={{
            borderBottom: '1px solid gray',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100svw',
            flex: '0 1 auto'
        }}>
            <Box className='navItem' component='span' sx={{flex: '1 1 0'}}>
                <Button size='md' onClick={() => setDrawerOpen(true)} variant='outline'>
                    <MenuIcon/>
                </Button>
            </Box>
            <Box className='navItem' component="span" sx={{display: 'flex', cursor: 'pointer', mx: 'auto', flex: '0 0 auto'}}
                 onClick={() => router.push('/home')}>
                <Image src={config.spaces.concat("/logos/BRECKS-v2@2x.png")}
                       alt="BRECKS"
                       width="177"
                       height="59"
                       style={{margin: 'auto'}}
                />
            </Box>
            <JobPicker className='navItem' sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, flex: '1 1 0'}} />
        </Box>
    </>
}
