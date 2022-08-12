import React from "react";
import { Link } from "react-router-dom";
import random from "./random.png";
import { useEffect, useRef, useState } from "react";
import { buyItemWithSPZ, buyItemWithXTZ, minSPZTokens } from "./adapters/tezos";

export default function TrendShip({ value, ship }) {
  const handleBuyXTZ = async () => {
    await buyItemWithXTZ(ship.price, ship.token_id);
  };
  const handleBuySPZ = async () => {
    await buyItemWithSPZ(ship.price / 10000, ship.token_id);
  };

  return (
    <>
      <div className="card">
        {value === "true" ? (
          <div className="img-tag" style={{ overflow: "hidden" }}>
            <div className="diag">
              <span className="rit">Coming Soon</span>
            </div>
            <img className="random" src={random} alt="not shown"></img>
            <span className="ident">Abstrac Girl</span>
            <div className="div-owner">
              <span className="owner">0 Owners</span>
            </div>
            <div className="dove">
              <button className="tez">0.99 XTZ</button>
              <button className="orz">0.99 SPZ</button>
            </div>
          </div>
        ) : (
          <div className="img-tag">
            <img className="random" src={ship.url} alt="not shown"></img>
            <span className="ident">{ship.name}</span>
            <div className="div-owner">
              <span className="owner">
                {ship.owners} {ship.owners == 1 ? " Owner" : "Owners"}
              </span>
            </div>
            <div className="dove">
              <button className="tez" onClick={handleBuyXTZ}>
                {ship.price / 1000000} XTZ
              </button>
              <button className="orz" onClick={handleBuySPZ}>{ship.price / 10000} SPZ</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}