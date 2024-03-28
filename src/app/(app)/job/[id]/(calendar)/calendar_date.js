import {Chip, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {JOB_STATUS, JOB_STATUS_COLORS} from "@/app/utils";
import Box from "@mui/joy/Box";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarDate({data, metadata, sx}) {
    const content = () => {
        if (!data) return <></>;
        else if (data?.currentCalendarMonth) {
            let content = ''

            let sx = {
                color: 'black'
            }

            const isBeforeToday = !metadata.todayIndex || metadata.index < metadata.todayIndex
            if (data.reportMissing) {
                content = isBeforeToday ? 'missing report' : 'pending submission'
                sx.color = 'var(--joy-palette-primary-500)'
            } else {
                if (data.status === 'ACTIVE') {
                    if (!metadata.todayIndex || metadata.index <= metadata.todayIndex) {
                        if (data.report) {
                            content = data.report.crewSize
                            sx.color = JOB_STATUS_COLORS[data.status]
                        } else {
                            content = 'N/A'
                            sx.color = '#00000080'
                        }
                    }
                } else {
                    content = JOB_STATUS[data.status]
                    sx.color = JOB_STATUS_COLORS[data.status] + '60'
                }
            }

                return <Typography textTransform='uppercase' fontWeight='700' className={RedHatFont.className} textAlign='center' sx={{width: 1, height: 1, fontSize: 18, ...sx}}>
                {content}
            </Typography>
        }
    }

    const renderMarkerChips = () => {
        let title, background, color

        if (metadata.index === metadata.todayIndex) {
            title = 'Today'
            background = '#705241'
            color = '#FFFFFF'
        } else if (metadata.index === metadata.startDateIndex) {
            title = 'Start'
            background = '#34C172'
            color = '#000000'
        } else return null

        return <Chip sx={{background: background, mx: 'auto'}}>
            <Typography className={RedHatFont.className} sx={{color: color, textTransform: 'uppercase'}}>{title}</Typography>
        </Chip>
    }

    return <Box onClick={data?.onClick} sx={{...sx, p: 1, border: '1px solid black', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', position: 'relative', ...data?.sx}}>
        <Typography level='title-lg' sx={{...data?.dateSX, zIndex: 0}}>{data?.date}</Typography>
        <Stack sx={{zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, p: 1}}>
            {renderMarkerChips()}
        </Stack>
        <Box sx={{display: 'content', mt: 1, flex: 1, width: 1, px: 1}}>
            {content()}
        </Box>
    </Box>
}
