import {postman} from "@/resources/config";

export async function validateToken(token) {
    return await postman.get('/validate', {
        headers: {
            'Authorization': 'BearerJWT ' + token
        }
    }).then((response) => {
        return response.status === 200;
    }).catch(() => {
        return false;
    })
}

export const JOB_STATUS = {
    NOT_STARTED: "NOT STARTED",
    ACTIVE: "ACTIVE",
    ON_HOLD: "ON HOLD",
    COMPLETED: "COMPLETED"
}

export const JOB_STATUS_COLORS = {
    NOT_STARTED: '#45362C', // var(--joy-palette-neutral-900)
    ACTIVE: '#00416A',
    ON_HOLD: '#960018',
    COMPLETED: '#34C172'
}

export const MONTHS = ['JANUARY', 'FEBRUARY',
    'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

export const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
