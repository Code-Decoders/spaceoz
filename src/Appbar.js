import React from "react";
import face from "./face.png"
import caret from "./caret-down.png"
import { Link } from "react-router-dom";

export default function Appbar() {
    return (
        <>
            <div className="dp-pic">
                <div className="div-face">
                    <img className="img-face" src={face} alt="face" />
                </div>
                <div className="user-info">
                    <div><span className="key-name">Adelaide Perry</span></div>
                    <div><img className="caret-down" src={caret} alt="dun"></img></div>
                </div>
            </div>
        </>
    )
}