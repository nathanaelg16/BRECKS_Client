'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Page({params}) {
    const router = useRouter()

    useEffect(() => {
        router.push(`/job/${params.id}`)
    })
}
