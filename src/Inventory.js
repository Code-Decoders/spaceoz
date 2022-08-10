import React from "react";
import Navbar from "./components/Navbar";
import photo from "./search.png"
import fil from "./filter.png"
import face from "./face.png"
import caret from "./caret-down.png"
import random from './random.png'
import vector from './vector.png'
import Appbar from "./components/Appbar";
import TrendShip from "./TrendShip";

export default function Inventory() {
    return (
        <div className="inven-page">
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
                    <span className="Heading">Trending Warships</span>
                    <div className="card-begin">
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                        <TrendShip />
                    </div>
                </div>
                <div className="table-start">
                    <span className="Headin">Top Upgrades</span>
                    <div className="table-box">
                        <table>
                            <tbody><tr>
                                <th>S No</th>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Country</th>
                            </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Alfreds Futterkiste</td>
                                    <td>Maria Anders</td>
                                    <td>Germany</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Centro comercial Moctezuma</td>
                                    <td>Francisco Chang</td>
                                    <td>Mexico</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Ernst Handel</td>
                                    <td>Roland Mendel</td>
                                    <td>Austria</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Island Trading</td>
                                    <td>Helen Bennett</td>
                                    <td>UK</td>
                                </tr>
                            </tbody></table>
                    </div>
                </div>
            </div>
        </div >
    );
}