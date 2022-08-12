import React from "react";
import face from "../face.png";
import caret from "../caret-down.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getActiveAccount,
  connectAccount,
  clearActiveAccount,
} from "../adapters/tezos/index";

export default function Appbar() {
  const ref = useRef();
  const [isShown, setIsShown] = useState(false);
  const [wallet, setWallet] = useState(null);

  const handleLogin = async () => {
    if (!wallet) {
      console.log("connecting to tezos");
      let wallet = await connectAccount();
      setWallet(wallet);
    } else {
      console.log("clearing active account");
      await clearActiveAccount();
      setWallet(null);
    }
  };

  const init = async () => {
    let activeAccount = await getActiveAccount();
    setWallet(activeAccount);
  };

  useEffect(() => {
    init();
  }, []);

  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isShown && ref.current && !ref.current.contains(e.target)) {
        //setIsShown(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isShown]);

  return (
    <>
      {!wallet ? (
        <div className="dp-pic">
          <div className="user-info" onClick={handleLogin}>
            <div>
              <span className="key-name">Connect</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="dp-pic">
          <div className="user-info">
            <div>
              <span className="key-name">{wallet.address.slice(0, 10)}</span>
            </div>
            <div>
              <div className="wrapper" ref={ref}>
                <img
                  className="caret-down"
                  src={caret}
                  alt="dun"
                  onClick={() => handleClick()}
                ></img>
              </div>
            </div>
            {isShown && (
              <div
                className="shown"
                onClick={handleLogin}
              >
                <p className="write">Logout</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
