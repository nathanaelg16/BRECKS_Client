import {Chip, Stack, Tooltip} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {JOB_STATUS, JOB_STATUS_COLORS} from "@/app/utils";
import CircleIcon from "@mui/icons-material/Circle";
import Box from "@mui/joy/Box";
import {Red_Hat_Display} from "next/font/google";

const RedHatFont = Red_Hat_Display({subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800']})

export default function CalendarDate({data, metadata, sx}) {
    return <Box onClick={data?.onClick}
                sx={{...sx, cursor: 'pointer', p: 1, border: '1px solid black', '&:hover': {background: 'var(--joy-palette-neutral-100)'}, ...data?.sx}}>
        <Stack spacing={1} direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
            <Typography level='title-lg' sx={{...data?.dateSX}}>{data?.date}</Typography>
            {data?.today && <Chip sx={{background: '#705241'}}><Typography className={RedHatFont.className} sx={{color: 'white', textTransform: 'uppercase'}}>Today</Typography></Chip>}
            <Stack spacing={1} direction='row' justifyContent='flex-end' alignItems='center' flexWrap='wrap'>
                {data?.reportMissing && <Tooltip title='Missing report'><WarningAmberIcon sx={{color: '#FF9C24', fontSize: 28}} /></Tooltip>}
                {data?.status && <Tooltip title={JOB_STATUS[data?.status]}><CircleIcon sx={{fontSize: 18, color: JOB_STATUS_COLORS[data?.status]}}></CircleIcon></Tooltip>}
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
    </Box>
}
