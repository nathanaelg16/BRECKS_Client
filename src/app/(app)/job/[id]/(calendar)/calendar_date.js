import {Chip, Stack, Tooltip} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {JOB_STATUS, JOB_STATUS_COLORS} from "@/app/utils";
import Box from "@mui/joy/Box";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarDate({data, metadata, sx}) {
    const dataRow = (key, value) => {
        return <Stack direction='row' spacing={2}>
            <Typography className={RedHatFont.className} fontWeight='800' sx={{color: 'var(--joy-palette-neutral-900)'}}>{key}:</Typography>
            <Typography className={RedHatFont.className} fontWeight='600' sx={{color: 'var(--joy-palette-neutral-900)'}}>{value}</Typography>
        </Stack>
    }

    const content = () => {
        if (!data) return <></>;
        else if (data?.currentCalendarMonth) {
            if (data.reportMissing) return (
                <Box sx={{m: 'auto', width: 1, height: 1, display: 'flex', flexDirection: 'column'}}>
                    {/*<WarningAmberIcon sx={{color: '#FF9C24', m: 'auto', fontSize: 36}}/>*/}
                    <Typography fontWeight='700' fontSize='lg' className={RedHatFont.className} textAlign='center'
                                color='primary' textTransform='uppercase' sx={{m: 'auto', }}>
                        {!metadata.todayIndex || metadata.index < metadata.todayIndex ? 'missing report' : 'pending submission'}
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

                return (<Typography fontWeight='700' fontSize='xl' className={RedHatFont.className} textAlign='center'
                                    sx={{m: 'auto', ...sx}}>
                    {content}
                </Typography>)
            }
        }
    }

    return <Box onClick={data?.onClick}
                sx={{...sx, cursor: 'pointer', p: 1, border: '1px solid black', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, ...data?.sx}}>
        <Stack spacing={1} direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
            <Typography level='title-lg' sx={{...data?.dateSX}}>{data?.date}</Typography>
            {data?.today && <Chip sx={{background: '#705241'}}><Typography className={RedHatFont.className} sx={{color: 'white', textTransform: 'uppercase'}}>Today</Typography></Chip>}
            <Stack spacing={1} direction='row' justifyContent='flex-end' alignItems='center' flexWrap='wrap'>
                {data?.reportMissing && (!metadata.todayIndex || metadata.index < metadata.todayIndex) && <Tooltip title='Missing report'><WarningAmberIcon sx={{color: '#FF9C24', fontSize: 28}} /></Tooltip>}
                {/*{data?.status && <Tooltip title={JOB_STATUS[data?.status]}><CircleIcon sx={{fontSize: 18, color: JOB_STATUS_COLORS[data?.status]}}></CircleIcon></Tooltip>}*/}
                {/*{data?.status && <Chip sx={{background: JOB_STATUS_COLORS[data?.status]}}><Typography className={RedHatFont.className} sx={{color: 'white', textTransform: 'uppercase'}}>{JOB_STATUS[data?.status]}</Typography></Chip>}*/}
                {/*{metadata.index >= metadata.firstDayOfMonth && metadata.index <= (metadata.firstDayOfMonth + metadata.lastDateOfMonth - 1) &&*/}
                {/*    <Dropdown>*/}
                {/*        <MenuButton slots={{root: IconButton}}>*/}
                {/*            <SettingsIcon sx={{fontSize: 22, color: '#35383980', '&:hover': {color: '#353839FF', transform: 'rotate(80deg)'}}} />*/}
                {/*        </MenuButton>*/}
                {/*        <Menu>*/}
                {/*            <MenuItem>Change status</MenuItem>*/}
                {/*        </Menu>*/}
                {/*    </Dropdown>}*/}
            </Stack>
        </Stack>
        <Stack spacing={1} sx={{p: 2}}>
            {content()}
        </Stack>
    </Box>
}
