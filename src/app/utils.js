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
