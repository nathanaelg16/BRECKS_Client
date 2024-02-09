import {Card, CardContent, CircularProgress} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportSharpIcon from '@mui/icons-material/ReportSharp';
import {useEffect, useState} from "react";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function ReportStats({sx, ratioMissing}) {
    const [level, setLevel] = useState(0)

    useEffect(() => {
        if (ratioMissing === 0.00) setLevel(0)
        else if (ratioMissing <= 0.30) setLevel(1)
        else setLevel(2)
    }, [ratioMissing])

    const colors = [
        {
            background: '#54C97B',
            color: '#000000',
            progressColor: '#E6F2E5'
        }, {
            background: '#FF9C24',
            color: '#000000',
            progressColor: '#FFECD5'
        }, {
            background: '#C54242',
            color: '#FFFFFF',
            progressColor: '#E60026'
        }
    ]

    const statusIcon = [
        <ThumbUpOffAltIcon sx={{color: colors[level]['color']}} key={0} />,
        <WarningAmberIcon sx={{color: colors[level]['color']}} key={1} />,
        <ReportSharpIcon sx={{color: colors[level]['color']}} key={2}/>
    ]

    const data = [
        {
            value: 100,
            message: 'All reports up to date!'
        }, {
            value: 75,
            message: 'Few missing reports'
        }, {
            value: 50,
            message: 'Several missing reports'
        }
    ]

    return <Card size='sm' sx={{...sx, background: !ratioMissing ? 'var(--joy-palette-neutral-300)' : colors[level]['background']}} variant="solid">
        <CardContent orientation="horizontal" sx={{alignItems: 'center'}}>
            <CircularProgress size="lg" determinate={!!ratioMissing} value={!ratioMissing ? 75 : data[level]['value']} sx={{'--CircularProgress-progressColor': !ratioMissing ? '#555555' : colors[level]['progressColor'], '--CircularProgress-trackColor': !ratioMissing ? '#2A3439' : colors[level]['color']}}>
                {!!ratioMissing && statusIcon[level]}
            </CircularProgress>
            <Typography className={RedHatFont.className} sx={{color: colors[level]['color']}} level="h3">{!!ratioMissing && data[level]['message']}</Typography>
        </CardContent>
    </Card>
}
