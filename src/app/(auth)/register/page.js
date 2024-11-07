'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {config} from "@/resources/config";
import {CircularProgress, FormHelperText, Sheet, Snackbar, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import Image from 'next/image'
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DangerousIcon from "@mui/icons-material/Dangerous";
import axios from "axios";

const postman = axios.create({
    baseURL: config.server,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default function Register() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState(false)
    const [accessKey, setAccessKey] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConf, setPasswordConf] = useState('')
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(false)
    const [snackbarError, setSnackbarError] = useState('')

    const [loading, setLoading] = useState({
        username: false,
        submit: false
    })

    const debounce = (callback, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {callback(...args)}, delay)
        }
    }

    const checkUsernameValidity = (username) => {
        if (username === null || username === '') {
            setUsernameError(null)
            setLoading({...loading, username: false})
        } else if (/^[0-9a-z]*$/i.test(username)) {
            postman.post('/registration/checkUnique', username, {
                headers: {
                    'Authorization': 'BearerAccessKey ' + accessKey
                }
            }).then(response => {
                setUsernameError(!response.data.unique)
            }).catch(error => {
                setSnackbarError('An error occurred while communicating with the server.')
            }).finally(() => {
                setLoading({...loading, username: false})
            })
        } else {
            setUsernameError(true)
            setLoading({...loading, username: false})
        }
    }

    const debouncedCheckUsernameValidity = useCallback(debounce(checkUsernameValidity, 1000), [accessKey, setUsernameError, setLoading])

    useEffect(() => {
        if (passwordConf !== null && passwordConf !== '') {
            setPasswordError(password !== passwordConf)
        } else setPasswordError(false)
    }, [password, passwordConf]);

    const handleRegistration = (data) => {
        postman.post('/register', {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password
        }).then(response => {
            if (response.status === 200) {
                sessionStorage.setItem('token', response.data.token)
                router.push('/home')
            } else {
                setError(response.data.message)
            }
        }).catch(error => {
            if (error.response && error.response.status === 400) setError(error.response.data.message)
            else setError("Something's not working right now. Please try again later.")
        }).finally(() => {
            setLoading({...loading, submit: false});
        })
    }

    return <>
        <Snackbar open={Boolean(snackbarError)} anchorOrigin={{vertical: 'top', horizontal: 'center'}} color='danger' variant='solid' startDecorator={<DangerousIcon/>}>
            <Typography sx={{color: 'white'}} level='title-md'>{snackbarError}</Typography>
        </Snackbar>
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Box sx={{my: 2, mb: 1, mx: 'auto'}}>
                <Image style={{margin: '0 auto',  width: '100%', height: 'auto'}} alt='BRECKS' src={'BRECKS-v2@2x.png'} width={400} height={133} sizes='(width >= 920px) 30svw, (width < 920px) 276px'/>
            </Box>
            <Sheet sx={{my: 0, mx: {md: 'calc(0.25 * 100svw)', sm: 'calc(0.15 * 100svw)', xs: 0}, p: 3, borderRadius: {sm: '10px', xs: 0}}}>
                <Typography level='h3' sx={{mb: 2}}>
                    Registration
                </Typography>
                <form autoComplete={"off"} onSubmit={(event) => {
                    event.preventDefault()

                    if (usernameError || passwordError) {
                        setError("Please correct the errors.")
                        return;
                    } else setError(false)

                    if (loading.username) return;

                    setLoading({...loading, submit: true})
                    const formElements = event.currentTarget.elements
                    const data = {
                        firstName: formElements.firstName.value,
                        lastName: formElements.lastName.value,
                        username: formElements.username.value,
                        password: formElements.password.value,
                        passwordConf: formElements.passwordConf.value
                    }
                    handleRegistration(data)
                }}>
                    <Stack direction="column" spacing={2}>
                        <FormControl required>
                            <FormLabel>First Name</FormLabel>
                            <Input type="text" name="firstName"/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" name="lastName"/>
                        </FormControl>
                        <FormControl error={usernameError} required>
                            <FormLabel>Username</FormLabel>
                            <Input type="text"
                                   name="username"
                                   onChange={(e) => {
                                       setLoading({...loading, username: true})
                                       debouncedCheckUsernameValidity(e.target.value)
                                   }}
                                   error={usernameError}
                                   endDecorator={loading.username ? <CircularProgress size={'sm'} />: usernameError === null ? null : usernameError ? <CloseIcon color={'error'} /> : <CheckIcon color={'success'}/>}
                            />
                            {usernameError && <FormHelperText>Username is not unique or is not alphanumeric.</FormHelperText>}
                        </FormControl>
                        <FormControl error={passwordError} required>
                            <FormLabel>Password</FormLabel>
                            <Input error={passwordError} onChange={(e) => setPassword(e.target.value)} type="password" name="password"/>
                            <FormHelperText>8-20 characters. Must include at least one uppercase letter, one lowercase letter, one number, and one symbol.</FormHelperText>
                        </FormControl>
                        <FormControl error={passwordError} required>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input error={passwordError} onChange={(e) => setPasswordConf(e.target.value)} type="password" name="passwordConf"/>
                            {passwordError && <FormHelperText>Passwords must match.</FormHelperText>}
                        </FormControl>
                        <Button loading={loading.submit} type="submit" fullWidth>
                            Register
                        </Button>
                    </Stack>
                </form>
                <Box sx={{width: '100%', display: 'flex'}}>
                    <Typography sx={{mx: 'auto', my: 1, width: '100%', textAlign: 'center'}} color={'danger'} variant={error ? 'soft' : 'plain'}>{error ? error : null}</Typography>
                </Box>
            </Sheet>
        </Box>
    </>
}
