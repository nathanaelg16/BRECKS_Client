import {Chip, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {JOB_STATUS, JOB_STATUS_COLORS} from "@/app/utils";
import Box from "@mui/joy/Box";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarDate({data, metadata, sx}) {
    const content = () => {
        if (!data) return <></>;
        else if (data?.currentCalendarMonth) {
            const isBeforeToday = !metadata.todayIndex || metadata.index < metadata.todayIndex
            if (data.reportMissing) return (
                <Box sx={{m: 'auto', width: 1, height: 1, display: 'flex', flexDirection: 'column'}}>
                    <Typography fontWeight='700' fontSize='lg' className={RedHatFont.className} textAlign='center'
                                color='primary' textTransform='uppercase' sx={{m: 'auto', }}>
                        {isBeforeToday ? 'missing report' : 'pending submission'}
                    </Typography>
                </Box>
            )
            else {
                let content = ''
                const sx = {
                    color: 'black'
                }

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

                return (<Typography fontWeight='700' fontSize='xl' className={RedHatFont.className} textAlign='center' sx={{m: 'auto', ...sx}}>
                    {content}
                </Typography>)
            }
        }
    }

    const renderMarkerChips = () => {
        if (metadata.index === metadata.todayIndex || metadata.index === metadata.startDateIndex) {
            const title = metadata.todayIndex ? 'Today' : 'Start'
            const background = metadata.todayIndex ? '#705241' : '#34C172'
            const color = metadata.todayIndex ? '#FFFFFF' : '#000000'

            return <Chip sx={{background: background}}>
                <Typography className={RedHatFont.className} sx={{color: color, textTransform: 'uppercase'}}>{title}</Typography>
            </Chip>
        } else return null
    }

    return <Box onClick={data?.onClick} sx={{...sx, p: 1, border: '1px solid black', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, ...data?.sx}}>
        <Stack spacing={1} direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
            <Typography level='title-lg' sx={{...data?.dateSX}}>{data?.date}</Typography>
            {renderMarkerChips()}
            <Stack spacing={1} direction='row' justifyContent='flex-end' alignItems='center' flexWrap='wrap'>
                {data?.reportMissing && (!metadata.todayIndex || metadata.index < metadata.todayIndex) && <WarningAmberIcon sx={{color: '#FF9C24', fontSize: 28}} />}
            </Stack>
        </Stack>
        <Stack spacing={1} sx={{p: 2}}>
            {content()}
        </Stack>
    </Box>
}
