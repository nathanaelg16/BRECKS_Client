'use client'

import Box from "@mui/joy/Box";
import {Nunito_Sans} from "next/font/google";
import Typography from "@mui/joy/Typography";
import {useRouter} from "next/navigation";

const nunitoSans = Nunito_Sans({weight: ['400', '700', '900'], style: ['normal', 'italic'], subsets: ['latin']})

export default function Success() {
    const router = useRouter()

    setTimeout(() => router.push('/home'), 2500)

    return <Box sx={{textAlign: 'center', p: '40px 0', background: '#EBF0F5'}}>
        <Box className={nunitoSans.className} sx={{background: 'white', p: '60px', borderRadius: '4px', boxShadow: '0 2px 3px #C8D0D8', display: 'inline-block', m: '0 auto'}}>
            <Box sx={{borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', m: '0 auto'}}>
                <i style={{color: '#9ABC66', fontSize: '200px', lineHeight: '200px'}}>&#10003;</i>
            </Box>
            <Typography className={nunitoSans.className} level='h1' sx={{color: '#88B04B', mb: '10px'}} fontWeight='900' fontSize='40px'>Success</Typography>
            <Typography className={nunitoSans.className} level='body-md' sx={{color: '#404F5E', m: 0}} fontSize='20px'>Report submitted successfully!</Typography>
        </Box>
    </Box>
}
