'use client'

import Navbar from "@/app/(app)/navbar";
import {SnackbarContext} from "@/app/(app)/context";
import Footer from "@/app/footer";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Snackbar} from "@mui/joy";
import {useState} from "react";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";

export default function AppLayout({children}) {
    const [snackbar, setSnackbar] = useState({
        color: 'neutral',
        open: false,
        vertical: 'bottom',
        horizontal: 'left',
        icon: <InfoIcon />,
        sx: {},
        textSX: {},
        text: '',
        autoHideDuration: 5000,
        variant: 'soft'
    })

    const updateSnackbar = (type, options) => {
        let update = {
            open: true,
            vertical: 'bottom',
            horizontal: 'left',
            sx: {},
            textSX: {},
            text: '',
            autoHideDuration: 5000,
            variant: 'soft'
        }

        if (type === 'success') {
            update.icon = <CheckCircleIcon />
            update.color = 'success'
            update.text = 'Action completed successfully!'
        } else if (type === 'error') {
            update.icon = <DangerousIcon />
            update.color = 'danger'
            update.text = 'A critical error occurred. Please refresh the page and try again.'
        } else if (type === 'info') {
            update.icon = <InfoIcon />
            update.color = 'neutral'
        }

        setSnackbar({...update, ...options})
    }

    return <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <SnackbarContext.Provider value={updateSnackbar}>
            <Navbar />
            <main style={{flex: '1 1 auto'}}>
                {children}
            </main>
            <Footer/>
            <Snackbar autoHideDuration={snackbar.autoHideDuration} variant={snackbar.variant} color={snackbar.color} open={snackbar.open} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{vertical: snackbar.vertical, horizontal: snackbar.horizontal}} key='nav-snackbar' sx={{...snackbar.sx}}>
                <Typography startDecorator={snackbar.icon} sx={{color: 'black', ...snackbar.textSX}} level='body-lg' fontWeight='500'>{snackbar.text}</Typography>
            </Snackbar>
        </SnackbarContext.Provider>
    </Box>
}
