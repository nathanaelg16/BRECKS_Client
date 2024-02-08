'use client'

import Navbar from "@/app/(app)/navbar";
import {UserContext} from "@/app/(app)/user_context";
import Footer from "@/app/footer";
import Box from "@mui/joy/Box";

export default function AppLayout({children}) {

    const user = {teamID: 1} //todo implement fetching user

    return <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <UserContext.Provider value={user}>
        <Navbar />
        <main style={{flex: '1 1 auto'}}>
            {children}
        </main>
        <Footer/>
        </UserContext.Provider>
    </Box>
}
