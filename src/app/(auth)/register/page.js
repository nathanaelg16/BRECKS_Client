'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {config, postman} from "@/resources/config";
import {CircularProgress, FormHelperText, Sheet, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import Image from 'next/image'
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function Register() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState(false)
    const [block, setBlock] = useState(false)
    const [accessKey, setAccessKey] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConf, setPasswordConf] = useState('')
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(false)

    const [loading, setLoading] = useState({
        username: false,
        submit: false
    })

    const [userDetails, setUserDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: ''
    })

    useEffect(() => {
        const initialAccessKey = searchParams.get('q')

        if (initialAccessKey === null) {
            setBlock(true)
            return;
        }

        setAccessKey(initialAccessKey)
        postman.get('/registration/details', {
            headers: {
                'Authorization': 'BearerAccessKey ' + initialAccessKey
            }
        }).then(response => {
            setUserDetails(response.data)
        }).catch(error => {
            // todo implement more error handling
            if (error.response) {
                if (error.response.status === 401) {
                    router.push('/register')
                }
            }
        })
    }, [searchParams, accessKey])

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
                if (response.status === 200) {
                    setUsernameError(!response.data.unique)
                }
                else {
                    // todo implement error handling
                }
            }).catch(error => {
                // todo implement error handling
            }).finally(() => {
                setLoading({...loading, username: false})
            })
        } else {
            setUsernameError(true)
            setLoading({...loading, username: false})
        }
    }

    const debouncedCheckUsernameValidity = useCallback(debounce(checkUsernameValidity, 1000), [accessKey])

    useEffect(() => {
        if (passwordConf !== null && passwordConf !== '') {
            setPasswordError(password !== passwordConf)
        } else setPasswordError(false)
    }, [password, passwordConf]);

    const handleRegistration = (data) => {
        postman.post('/register', {
            displayName: data.displayName,
            username: data.username,
            password: data.password
        }, {
            headers: {
                'Authorization': 'BearerAccessKey ' + accessKey
            }
        }).then(response => {
            if (response.status === 200) {
                sessionStorage.setItem('token', response.data.token)
                router.push('/')
            } else {
                setError(response.data.message)
            }
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(error.response.data.message)
                    return;
                }
            }
            setError("Something's not working right now. Please try again later.")
        }).finally(() => {
            setLoading({...loading, submit: false});
        })
    }

    const blockedView = <>
        <Box sx={{display: 'flex', flexDirection: 'column', height: '95svh'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', m: '20svh auto'}}>
                <Image style={{margin: '5px auto'}} alt='BRECKS' src={config.spaces.concat('/logos/BRECKS-v2@2x.png')} width={500} height={166}/>
                <Typography sx={{m: '10px auto'}} level='title-lg'>
                    For access to this page, please use the link provided in your email.<br/>
                    If you have not yet received a link, please contact your administrator.
                </Typography>
            </Box>
        </Box>
    </>

    const registrationView = <>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box onClick={() => router.push('/')} sx={{my: 2, mb: 1, mx: 'auto', cursor: 'pointer'}}>
                <Image style={{margin: '0 auto'}} alt='BRECKS' src={config.spaces.concat('/logos/BRECKS-v2@2x.png')} width={400} height={133}/>
            </Box>
            <Sheet sx={{width: '60vw', m: '0 auto', p: 3, borderRadius: '10px'}}>
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
                        displayName: formElements.displayName.value,
                        username: formElements.username.value,
                        password: formElements.password.value,
                        passwordConf: formElements.passwordConf.value
                    }
                    handleRegistration(data)
                }}>
                    <Stack direction="column" spacing={2}>
                        <FormControl disabled>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="email" name="email" value={userDetails.email}/>
                        </FormControl>
                        <FormControl disabled>
                            <FormLabel>First Name</FormLabel>
                            <Input type="text" name="firstName" value={userDetails.firstName}/>
                        </FormControl>
                        <FormControl disabled>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" name="lastName" value={userDetails.lastName}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Display Name</FormLabel>
                            <FormHelperText>What would you like other users to know you as?</FormHelperText>
                            <Input type="text" name="displayName" defaultValue={userDetails.firstName}/>
                        </FormControl>
                        <FormControl error={usernameError} required>
                            <FormLabel>Username</FormLabel>
                            <FormHelperText>What would you like to sign in as?</FormHelperText>
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

    return <>
        {block ? blockedView : registrationView}
    </>
}
