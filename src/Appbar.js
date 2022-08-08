import React from "react";
import face from "./face.png"
import caret from "./caret-down.png"
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react"


export default function Appbar() {
    const ref = useRef()
    const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
        setIsShown(current => !current);
    };

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (isShown && ref.current && !ref.current.contains(e.target)) {
                setIsShown(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [isShown])
    return (
        <>
            <div className="dp-pic">
                <div className="div-face">
                    <img className="img-face" src={face} alt="face" />
                </div>
                <div className="user-info">
                    <div><span className="key-name">Adelaide Perry</span></div>
                    <div><div className="wrapper" ref={ref}><img className="caret-down" src={caret} alt="dun" onClick={() => handleClick()}></img></div>
                    </div>
                    {isShown && (
                        <div className="shown">
                            <p className="write">Logout</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}