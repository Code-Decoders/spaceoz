import React from "react";
import { Link } from "react-router-dom";
import random from './random.png'
import vector from './vector.png'
import { useEffect, useRef, useState } from "react"

export default function TrendShip() {
    const ref = useRef()
    const [isShow, setIsShow] = useState(false);

    const handleClick = event => {
        setIsShow(current => !current);
    };

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (isShow && ref.current && !ref.current.contains(e.target)) {
                setIsShow(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [isShow])
    return (
        <>
            <div className="card">
                <div className="img-tag">
                    <div className="wrapper" ref={ref}><img className="random" src={random} alt="not shown" onClick={() => handleClick()}></img></div>
                    <div className="wrapper" ref={ref}><span className="ident" onClick={() => handleClick()}>Abstrac Girl</span></div>
                    <div className="div-owner"><span className="owner">10 Owners</span></div>
                    <img className="vector" src={vector} alt="mini"></img>
                    <span className="money">0.99 ETH</span>
                </div>
            </div>
            {isShow && (
                <div className="fas-gye">
                    <p>HEHEHE</p>
                </div>
            )}
        </>
    );
}