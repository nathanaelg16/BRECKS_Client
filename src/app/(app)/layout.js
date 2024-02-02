'use client'

import Navbar from "@/app/(app)/navbar";
import {UserContext} from "@/app/(app)/user_context";

export default function AppLayout({children}) {

    const user = {teamID: 1} //todo implement fetching user

    return <>
        <UserContext.Provider value={user}>
        <Navbar />
        <main>
            {children}
        </main>
        </UserContext.Provider>
    </>
}
