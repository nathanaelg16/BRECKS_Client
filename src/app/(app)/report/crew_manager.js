'use client'

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {
    Autocomplete,
    AutocompleteOption,
    Chip,
    ChipDelete,
    createFilterOptions,
    ListItemDecorator,
    Stack
} from "@mui/joy";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useEffect, useState} from "react";
import {postman} from "@/resources/config";
import AddIcon from '@mui/icons-material/Add';
import {Add} from "@mui/icons-material";

export default function CrewManager({withCrew}) {
    const [crew, setCrew] = withCrew;
    const [contractors, setContractors] = useState([])
    const [selectedContractor, setSelectedContractor] = useState(null)
    const [selectedCrewSize, setSelectedCrewSize] = useState(undefined)
    const filter = createFilterOptions();

    useEffect(() => {
        postman.get('/contractors').then((response) => {
            if (response.status === 200) {
                setContractors(response.data.sort((a, b) => a.shortName.localeCompare(b.shortName)))
            }
        }).catch((error) => {
            // todo implement error handling
            console.log(error)
        })
    }, [])

    const calculateCrewSize = (c) => {
        return c.reduce((sum, val) => sum + val, 0)
    }

    return <Stack spacing={2}>
        <Typography><Typography fontWeight='900'>Total Crew Size:</Typography> {calculateCrewSize(crew)}</Typography>

        <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
            {crew.entrySeq().map(([contractor, crewSize]) => <Chip size='md' key={contractor.shortName} endDecorator={<ChipDelete onDelete={() => setCrew(crew.delete(contractor))} />}><strong>{contractor.shortName}:</strong> {crewSize}</Chip>)}
        </Box>

        <Box sx={{display: 'flex', justifyContent: 'flex-start', gap: 3, alignItems: 'end'}}>
            <FormControl>
                <FormLabel>Contractor</FormLabel>
                <Autocomplete
                    value={selectedContractor}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setSelectedContractor({
                                shortName: newValue,
                            });
                        } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setSelectedContractor({
                                shortName: newValue.inputValue,
                            });
                        } else {
                            setSelectedContractor(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.shortName);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                shortName: `Add "${inputValue}"`,
                            });
                        }

                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    options={contractors}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.shortName;
                    }}
                    renderOption={(props, option) => (
                        <AutocompleteOption {...props}>
                            {option.shortName?.startsWith('Add "') && (
                                <ListItemDecorator>
                                    <Add />
                                </ListItemDecorator>
                            )}

                            {option.shortName}
                        </AutocompleteOption>
                    )}
                />
            </FormControl>
            <FormControl sx={{maxWidth: '80px'}}>
                <FormLabel>Crew Size</FormLabel>
                <Input placeholder={'0'} value={selectedCrewSize} onChange={(e) => {
                    let val = e.target.value ? parseInt(e.target.value) : 0
                    if (!isNaN(val)) setSelectedCrewSize(val)
                }}/>
            </FormControl>
            <Button disabled={selectedContractor === null || selectedCrewSize === null} onClick={() => setCrew(crew.set(selectedContractor, selectedCrewSize))}><AddIcon /></Button>
        </Box>
    </Stack>
}
