import {useCallback, useEffect, useId, useLayoutEffect} from "react";
import {createPortal} from "react-dom";
import {Sheet} from "@mui/joy";
import "./popper.css"

export default function Popper({open, anchor, sx = {}, children, onClose = () => {}}) {
    const id = useId()
    const clickCapture = useCallback((event) => {
        const popper = document.getElementById(id)
        if (open && event.target.id !== popper.id && !popper.contains(event.target)) onClose()
    }, [open, id, onClose])

    useLayoutEffect(() => {
        let popperRoot = document.getElementById('popperRoot')

        if (!popperRoot) {
            popperRoot = document.createElement('div')
            popperRoot.id = 'popperRoot'
            popperRoot.style.zIndex = '-9000'
            document.body.insertAdjacentElement('beforeend', popperRoot)
        }

        popperRoot.addEventListener('click', clickCapture, true)

        return () => {
            popperRoot.removeEventListener('click', clickCapture, true)
        }
    }, [clickCapture])

    useLayoutEffect(() => {
        const popper = document.getElementById(id)
        const popperRoot = document.getElementById('popperRoot')

        if (anchor && popper && popperRoot) {
            const anchorBox = anchor.getBoundingClientRect()
            const popperBox = popper.getBoundingClientRect()
            const popperRootBox = popperRoot.getBoundingClientRect()
            const anchorBoxWidth = anchorBox.right - anchorBox.left
            const anchorBoxMidpoint = anchorBox.left + anchorBoxWidth / 2
            const popperWidth = popperBox.right - popperBox.left
            popper.style.left = `${anchorBoxMidpoint - popperWidth / 2}px`
            popper.style.top = `${anchorBox.bottom}px`
            popper.style.maxHeight = `${0.90 * (popperRootBox.bottom - anchorBox.bottom)}px`
            popper.style.maxWidth = `${0.95 * (popperRootBox.right - (anchorBoxMidpoint - popperWidth / 2))}px`
        }
    }, [anchor, id])

    useEffect(() => {
        const popperRoot = document.getElementById('popperRoot')
        popperRoot.style.zIndex = open ? '9000' : '-9000'
    }, [open])

    const popperRoot = document.getElementById('popperRoot')
    const popper = <Sheet className={`popper`} variant='soft' id={id} sx={{mt: 1, py: 1, px: 2, display: open ? 'inline-block' : 'none', userSelect: 'none',...sx}}>
            {children}
        </Sheet>

    return popperRoot ? createPortal(popper, popperRoot, id) : <></>
}
