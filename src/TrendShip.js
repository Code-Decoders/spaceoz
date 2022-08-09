import React from "react";
import { Link } from "react-router-dom";
import random from './random.png'
import vector from './vector.png'
import { useEffect, useRef, useState } from "react"

export default function TrendShip() {
    return (
        <>
            <div className="card">
                <div className="img-tag">
                    <img className="random" src={random} alt="not shown"></img>
                    <span className="ident">Abstrac Girl</span>
                    <div className="div-owner"><span className="owner">10 Owners</span></div>
                    <img className="vector" src={vector} alt="mini"></img>
                    <span className="money">0.99 ETH</span>
                </div>
            </div>
        </>
    );
}