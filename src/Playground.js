import React from "react";
import Navbar from "./Navbar";
import Appbar from "./Appbar";
import photo from "./search.png"
import fil from "./filter.png"

export default function Playground() {
    return (
        <div className="playgame">
            <div className="left">
                <Navbar />
            </div>
            <div className="right">
                <div className="Top">
                    <div className="input-div">
                        <img className="hold1" src={photo} alt="not" />
                        <input className="tag-input" type="text" placeholder="Search Nfts..." />
                        <img className="hold2" src={fil} alt="not" />
                    </div>
                    <Appbar />
                </div>
                <div className="Middle">
                </div>
            </div>
        </div >
    );
}