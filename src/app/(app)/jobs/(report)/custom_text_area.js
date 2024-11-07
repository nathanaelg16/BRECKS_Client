import {Stack, styled} from "@mui/joy";
import {TextareaAutosize as Textarea} from "@mui/base/TextareaAutosize/TextareaAutosize";
import "./custom_text_area.css"
import Box from "@mui/joy/Box";

const StyledTextArea = styled(Textarea)(({theme}) => `
  resize: none;
  width: 100%;
  color: black;
  background: transparent;
  border: none;
  padding: 10px 15px 10px;
  font-size: 1.1rem;

  &:disabled {
    border: none;
    color: black;
  }
  
  &:focus {
    outline: none !important;
  }
`)

export const CustomTextArea = (props) => {
    return <Stack className={`customTextArea ${props.disabled ? 'disabled' : ''}`} direction='row' alignItems='center' spacing={1} useFlexGap sx={{width: 1, border: '1px solid var(--joy-palette-neutral-400)', borderRadius: '20px', fontSize: '1.1rem', cursor: 'text'}}>
        <StyledTextArea disabled={props.disabled} className={props.className} minRows={props.minRows} value={props.value} onChange={props.onChange} />
        <Box sx={{display: 'container', pr: 1}}>
            {props.endDecorator}
        </Box>
    </Stack>
}
