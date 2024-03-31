import {Chip, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {DAYS, JOB_STATUS, JOB_STATUS_COLORS, MONTHS} from "@/app/utils";
import Box from "@mui/joy/Box";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarDate({data, metadata, sx, size}) {
    const medium = () => {
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

    const small = () => {
        const content = () => {
            if (!data) return <></>;
            else if (data?.currentCalendarMonth) {
                let content = ''

                let sx = {
                    color: 'black'
                }

                const isBeforeToday = !metadata.todayIndex || metadata.index < metadata.todayIndex
                if (data.reportMissing) return <Typography textTransform='uppercase' fontWeight='700' className={RedHatFont.className} textAlign='left' sx={{width: 1, height: 1, fontSize: 18, color: 'var(--joy-palette-primary-500)'}}>
                        {isBeforeToday ? 'missing report' : 'pending submission'}
                    </Typography>
                else {
                    if (data.status === 'ACTIVE') {
                        if (!metadata.todayIndex || metadata.index <= metadata.todayIndex) {
                            if (data.report) {
                                return <Stack width={1} flexDirection='row' justifyContent='left' alignItems='center' spacing={2} useFlexGap flexWrap='wrap'>
                                    {data.report.crew && Object.entries(data.report.crew).map(([crew, size], i) => <Chip sx={{color: JOB_STATUS_COLORS[data.status]}} key={i}><strong>{crew}:</strong> {size}</Chip>)}
                                    <Chip sx={{color: 'black'}}>{data.report.crewSize} total</Chip>
                                </Stack>
                            } else return <Typography textTransform='uppercase' fontWeight='700' className={RedHatFont.className} textAlign='left' sx={{width: 1, height: 1, fontSize: 18, color: '#00000080'}}>N/A</Typography>
                        }
                    } else return <Typography textTransform='uppercase' fontWeight='700' className={RedHatFont.className} textAlign='left' sx={{width: 1, height: 1, fontSize: 18, color: sx.color = JOB_STATUS_COLORS[data.status] + '60'}}>
                            {JOB_STATUS[data.status]}
                        </Typography>
                }
            }
        }

        const renderMarkerChips = () => {
            const todayChip = metadata.index === metadata.todayIndex ? <Chip sx={{background: '#0179C4'}}>
                <Typography className={RedHatFont.className} sx={{color: '#FFFFFF', textTransform: 'uppercase'}}>Today</Typography>
            </Chip> : null

            const startChip = metadata.index === metadata.startDateIndex ? <Chip sx={{background: '#34C172'}}>
                <Typography className={RedHatFont.className} sx={{color: '#000000', textTransform: 'uppercase'}}>Start</Typography>
            </Chip> : null

            return <>
                {todayChip}
                {startChip}
            </>
        }

        return <Box onClick={data?.onClick} sx={{...sx, pb: 1, border: '2px solid var(--joy-palette-neutral-800)', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', position: 'relative', mx: 1, ...data?.sx}}>
            <Stack width={1} spacing={3} flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{background: 'var(--joy-palette-primary-700)', p: 1}} useFlexGap>
                <Typography level='title-lg' sx={{...data?.dateSX, color: 'white'}}>
                    {DAYS[metadata.dayOfWeek]}, {MONTHS[metadata.calendar.month]} {data?.date}, {metadata.calendar.year}
                </Typography>
                {renderMarkerChips()}
            </Stack>
            <Box sx={{display: 'content', mt: 1, flex: 1, width: 1, p: 1}}>
                {content()}
            </Box>
        </Box>
    }

    return size === 'md' ? medium() : small()
}
