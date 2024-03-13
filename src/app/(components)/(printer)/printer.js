import Box from "@mui/joy/Box";
import {useId, useLayoutEffect, useRef} from "react";
import {createPortal} from "react-dom";
import "./printer.css"

export default function Printer({children, print = false}) {
    const id = useId()
    const ref = useRef()

    console.log(`Printer ${id}: ${print ? '' : 'NOT '}ACTIVE`)

    useLayoutEffect(() => {
        let printerRoot = document.getElementById(`printerRoot-${id}`)

        if (!printerRoot) {
            printerRoot = document.createElement('div')
            printerRoot.className = 'printer'
            printerRoot.id = `printerRoot-${id}`
            document.body.insertAdjacentElement('beforeend', printerRoot)
        }

        return () => {
            printerRoot.remove()
        }
    }, [id]);

    const printerRoot = document.getElementById(`printerRoot-${id}`)

    const contents = <Box id={`printerContents-${id}`} className={`printerContent`} ref={ref} display='contents'>
        {children}
    </Box>

    return print ? createPortal(contents, printerRoot, id) : contents
}
