import {Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {postman} from "@/resources/config";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useContext, useState} from "react";
import {SnackbarContext} from "@/app/(app)/context";

export default function NewContractorForm({onClose}) {
    const [loading, setLoading] = useState(false)
    const setSnackbar = useContext(SnackbarContext)

    return <>
        <form autoComplete="off" onSubmit={(event) => {
            event.preventDefault()
            setLoading(true)
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData).entries())
            postman.post('/contractors', formJson)
                .then(response => {
                    if (response.status === 200) {
                        setSnackbar('success', {text: 'Contractor added successfully!'})
                    } else throw new Error(`Response status code: ${response.status}`)
                }).catch((error) => {
                    if (error?.response?.status === 409) setSnackbar('error', {text: error.response.data.message})
                    else setSnackbar('error')
            }).finally(() => {
                setLoading(false)
                onClose()
            })
        }}>
            <Stack spacing={2} sx={{userSelect: "none"}}>
                <Typography textAlign="center" level="title-lg">Contractor Details</Typography>
                <FormControl>
                    <FormLabel>Entity Name</FormLabel>
                    <Input name='entityName' required placeholder='ABC Construction, LLC'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Abbreviation (D/B/A)</FormLabel>
                    <Input name='shortName' placeholder='ABC'/>
                </FormControl>
                <Button loading={loading} type="submit" color="primary" variant="soft">Create</Button>
            </Stack>
        </form>
    </>
}
