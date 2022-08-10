import React from "react";
import { Link } from "react-router-dom";
import random from './random.png'
import { useEffect, useRef, useState } from "react"

export default function TrendShip() {
    return (
        <>
            <div className="card">
                <div className="img-tag">
                    <img className="random" src={random} alt="not shown"></img>
                    <span className="ident">Abstrac Girl</span>
                    <div className="div-owner"><span className="owner">10 Owners</span></div>
                    <div className="dove">
                        <button className="tez">0.99 XTZ</button>
                        <button className="orz">0.99 SPZ</button>
                    </div>
                </div>
            </div>
        </>
    );
}