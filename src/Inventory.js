import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import photo from "./search.png";
import fil from "./filter.png";
import face from "./face.png";
import caret from "./caret-down.png";
import random from "./random.png";
import vector from "./vector.png";
import Appbar from "./components/Appbar";
import TrendShip from "./TrendShip";
import Img from "./Img.png";
import {
  buyItemWithSPZ,
  buyItemWithXTZ,
  getActiveAccount,
  getInventoryContractStorage,
  minSPZTokens,
} from "./adapters/tezos";
import { bytes2Char } from "@taquito/utils";
import {  unpackDataBytes } from "@taquito/michel-codec";

export default function Inventory() {
  const [ships, setShips] = useState([]);
  const [bullets, setBullets] = useState([]);
  useEffect(() => {
    getGameData();
  }, []);

  const handleBuyXTZ = async () => {
    minSPZTokens(10, 'tz1eHDxGHWcyobNnocRVeQUHhpYrM1kBtYTx')
    // await buyItemWithXTZ(bullet.price, bullet.token_id);
  };
  const handleBuySPZ = async (bullet) => {
    await buyItemWithSPZ(bullet.price / 10000, bullet.token_id);
  };

  const getGameData = () => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8];

    getInventoryContractStorage().then((storage) => {
      const meta = storage.token_metadata;
      ids.forEach((item) => {
        storage.ledger.get(`${item}`).then((l) =>
          meta.get(`${item}`).then((result) => {
            const src = { bytes: result.token_info.get("price") };
            const typ = {
              prim: "nat",
            };
            const _data = {
              name: bytes2Char(result.token_info.get("name")),
              url: bytes2Char(result.token_info.get("url")),
              price: parseInt(unpackDataBytes(src, typ).int),
              token_id: item,
              owners: l.length,
            };
            if (item < 6) {
              setShips((ships) => [...ships, _data]);
            } else {
              setBullets((bullets) => [...bullets, _data]);
            }
            console.log(_data);
          })
        );
      });
    });
  };
  return (
    <div className="inven-page">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <div className="Top">
          <div className="input-div">
            <img className="hold1" src={photo} alt="not" />
            <input
              className="tag-input"
              type="text"
              placeholder="Search Nfts..."
            />
            <img className="hold2" src={fil} alt="not" />
          </div>
          <Appbar />
        </div>
        <div className="Middle">
          <span className="Heading">Trending Warships</span>
          <div className="card-begin">
            {/* <TrendShip value="true" />
            <TrendShip value="true" /> */}

            {ships.map((e) => (
              <TrendShip key={e.token_id} ship={e} />
            ))}
          </div>
        </div>
        <div className="table-start">
          <span className="Headin">Top Upgrades</span>
          <div className="table-box">
            <table>
              <tbody>
                <tr>
                  <th className="hide">SNo</th>
                  <th className="down">Collection</th>
                  <th>Damage</th>
                  <th>Buy</th>
                  <th>Owners</th>
                </tr>
                {bullets.map((e, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td className="mak-flex">
                      <img className="fix" src={e.url} alt="no"></img>{" "}
                      <p>{e.name}</p>
                    </td>
                    <td>
                      <div className="btn-grp">-20% Health</div>
                    </td>
                    <td>
                      <div className="btn-grp">
                        <button className="tez" onClick={() => handleBuyXTZ(e)}>
                          {e.price / 1000000} XTZ
                        </button>
                        <button className="orz" onClick={() => handleBuySPZ(e)}>
                          {e.price / 10000} SPZ
                        </button>
                      </div>
                    </td>
                    <td>{e.owners}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
