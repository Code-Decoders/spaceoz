import React from "react";
import Navbar from "./Navbar";
import Appbar from "./Appbar";

export default function Playground() {
    return (
        <div className="playgame">
            <div className="fixed-ele">
                <div className="hold3">
                    <Navbar />
                </div>
                <div className="hold4">
                    <Appbar />
                </div>
            </div>
            <div className="game-conc">
                
            </div>

        </div>
    );
}