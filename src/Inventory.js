import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import photo from "./search.png";
import fil from "./filter.png";
import face from "./bullet.png";
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
} from "./adapters/tezos";
import { bytes2Char } from "@taquito/utils";
import { unpackDataBytes } from "@taquito/michel-codec";

export default function Inventory() {
  const [ships, setShips] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getGameData();
  }, []);

  const handleBuyXTZ = async (bullet) => {
    await buyItemWithXTZ(bullet.price, bullet.token_id);
  };
  const handleBuySPZ = async (bullet) => {
    await buyItemWithSPZ(bullet.price / 10000, bullet.token_id);
  };

  const getGameData = async () => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8];

    var storage = await getInventoryContractStorage();
    const meta = storage.token_metadata;
    for (const id in ids) {
      var item = ids[id];
      var owners = await storage.ledger.get(`${item}`);
      var result = await meta.get(`${item}`);
      const src = { bytes: result.token_info.get("price") };
      const typ = {
        prim: "nat",
      };
      const _data = {
        name: bytes2Char(result.token_info.get("name")),
        url: bytes2Char(result.token_info.get("url")),
        price: parseInt(unpackDataBytes(src, typ).int),
        token_id: item,
        owners: owners.length,
      };
      if (item < 6) {
        setShips((ships) => [...ships, _data]);
      } else {
        setBullets((bullets) => [...bullets, _data]);
      }
      console.log(_data);
    }
    setLoading(false);
  };
  const [alarm, setAlarm] = useState("true");
  console.log(alarm);
  function myFunction() {
    let filter, table, tr, i, j;
    filter = document.getElementById("searchInput").value.toLowerCase();
    table = document.getElementById("userTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      tr[i].style.display = "none";
      const tdArray = tr[i].getElementsByTagName("td");
      for (j = 0; j < tdArray.length; j++) {
        const cellValue = tdArray[j];
        if (cellValue && cellValue.innerHTML.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
  return (
    <div className="inven-page" style={{ '--default': alarm === false ? '#6e6e6e' : null }}>
      <div className="left">
        <Navbar stateChanger={setAlarm} notify={alarm} />
      </div>
      <div className="right" style={{ backgroundColor: alarm === false ? '#f5f4fc' : null }}>
        <div className="Top">
          <div className="input-div">
            <img className="hold1" src={photo} alt="not" />
            <input
              onKeyUp={myFunction}
              id="searchInput"
              className="tag-input"
              type="text"
              placeholder="Search Nfts..."
            />
            <img className="hold2" src={fil} alt="not" />
          </div>
          <Appbar />
        </div>
        {loading ? <div style={{ display: "flex", alignItems: "center", top: 0, left: 240, bottom: 0, right: 0, justifyContent: "center", position: "absolute" }}>
          <div className="spinnerWrap">
            <div className="spinner" id="spinner2"></div>
          </div>
        </div> :
          <div className="Middle">
            <span className="Heading" style={{ color: alarm === false ? "black" : null }}>Trending Warships</span>
            <div className="card-begin">
              {ships.map((e) => (
                <TrendShip key={e.token_id} ship={e} />
              ))}
              <TrendShip value="true" />
              <TrendShip value="true" />
            </div>
            <div className="table-start" style={{ backgroundColor: alarm === false ? "#f5f4fc" : null }}>
              <span className="Headin" style={{ color: alarm === false ? "black" : null }}>Top Upgrades</span>
              <div className="table-box">
                <table id="userTable">
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
                          <img className="fix" src={e.url} alt="no"></img>
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
                    <tr>
                      <td>4</td>
                      <td className="mak-flex">
                        <img className="fix" src={face} alt="no"></img>
                        <p>Long Shot</p>
                      </td>
                      <td>
                        <div className="btn-grp">-30% Health</div>
                      </td>
                      <td>
                        <p>Coming Soon</p>
                      </td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
