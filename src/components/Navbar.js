import React, { useEffect, useState } from "react";
import logo from "../boy.png";
import { Link, useLocation } from "react-router-dom";
import {
  getBalance,
  getIGTContractStorage,
  getActiveAccount,
} from "../adapters/tezos";
import { BigNumber } from "bignumber.js";
import AnimatedNumber from "animated-number-react";

export default function Navbar({ stateChanger, notify }) {
  const [xtz, setXtz] = useState(0);
  const [token, setToken] = useState(0);
  useEffect(() => {
    getUserBalance();
    const interval = setInterval(() => {
      getUserBalance();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getUserBalance = () => {
    getActiveAccount().then((account) => {
      if (!account) return;
      getBalance().then((balance) => {
        console.log(balance);
        if (balance != xtz) setXtz(balance);
        getIGTContractStorage().then((storage) => {
          storage.ledger
            .get({
              0: account.address,
              1: "0",
            })
            .then((result) => {
              console.log(result);
              setToken(BigNumber(result).toNumber());
            });
        });
      });
    });
  };

  const { pathname } = useLocation();
  const stile = {
    overflow: "hidden",
    color: "#727191",
    width: "209px",
    height: "49px",
    color: "#b7abff",
    backgroundColor: "#201e43",
    border: "2px solid #000000",
    borderRightWidth: "thin",
    borderRadius: "5px 0px 0px 5px",
  };

  function d() {
    return pathname == "/" ? stile : null;
  }

  function b() {
    return pathname == "/playground" ? stile : null;
  }

  const toggle = document.getElementById("toggle");
  const root = document.querySelector(":root");
  const setProperty = (name, value) => root.style.setProperty(name, value);
  function wait() {
    setProperty("--default", notify === "false" ? "#d6dee1" : "#6e6e6e");
  }
  function name() {
    toggle.classList.toggle("active");
    stateChanger((current) => !current);
    wait();
  }
  const notShow = {
    display: "none",
  };
  function f() {
    return pathname == "/playground" ? notShow : null;
  }
  return (
    <>
      <div className="navBar">
        <div id="toggle" onClick={name} style={f()}>
          <i className="indicator" />
        </div>
        <div className="profile">
          <p className="Name">SpaceOZ</p>
        </div>
        <div className="navigate">
          <Link to="/">
            <div className="nav-btn" style={d()}>
              <div className="child">
                <svg
                  className="svg"
                  width={17}
                  height={17}
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.1042 7.79167C9.89595 7.79167 9.20833 7.10405 9.20833 3.89583C9.20833 0.687614 9.89595 0 13.1042 0C16.3124 0 17 0.687614 17 3.89583C17 7.10405 16.3124 7.79167 13.1042 7.79167ZM11.4493 6.25117C11.8126 6.33191 12.3344 6.375 13.1042 6.375C13.8739 6.375 14.3957 6.33191 14.759 6.25117C15.1062 6.17401 15.216 6.08252 15.2534 6.0451C15.2909 6.00768 15.3823 5.89787 15.4595 5.55068C15.5402 5.1874 15.5833 4.66555 15.5833 3.89583C15.5833 3.12611 15.5402 2.60426 15.4595 2.24099C15.3823 1.8938 15.2909 1.78399 15.2534 1.74657C15.216 1.70915 15.1062 1.61765 14.759 1.54049C14.3957 1.45976 13.8739 1.41667 13.1042 1.41667C12.3344 1.41667 11.8126 1.45976 11.4493 1.54049C11.1021 1.61765 10.9923 1.70915 10.9549 1.74657C10.9175 1.78399 10.826 1.8938 10.7488 2.24099C10.6681 2.60426 10.625 3.12611 10.625 3.89583C10.625 4.66555 10.6681 5.1874 10.7488 5.55068C10.826 5.89787 10.9175 6.00768 10.9549 6.0451C10.9923 6.08252 11.1021 6.17401 11.4493 6.25117Z"
                    fill={pathname == "/playground" ? "#727191" : "#B7ABFF"}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.89583 17C0.687614 17 0 16.3124 0 13.1042C0 9.89595 0.687614 9.20833 3.89583 9.20833C7.10405 9.20833 7.79167 9.89595 7.79167 13.1042C7.79167 16.3124 7.10405 17 3.89583 17ZM1.54049 14.759C1.45976 14.3957 1.41667 13.8739 1.41667 13.1042C1.41667 12.3344 1.45976 11.8126 1.54049 11.4493C1.61765 11.1021 1.70915 10.9923 1.74657 10.9549C1.78399 10.9175 1.8938 10.826 2.24099 10.7488C2.60426 10.6681 3.12611 10.625 3.89583 10.625C4.66555 10.625 5.1874 10.6681 5.55068 10.7488C5.89787 10.826 6.00768 10.9175 6.0451 10.9549C6.08252 10.9923 6.17401 11.1021 6.25117 11.4493C6.33191 11.8126 6.375 12.3344 6.375 13.1042C6.375 13.8739 6.33191 14.3957 6.25117 14.759C6.17401 15.1062 6.08252 15.216 6.0451 15.2534C6.00768 15.2909 5.89787 15.3823 5.55068 15.4595C5.1874 15.5402 4.66555 15.5833 3.89583 15.5833C3.12611 15.5833 2.60426 15.5402 2.24099 15.4595C1.8938 15.3823 1.78399 15.2909 1.74657 15.2534C1.70915 15.216 1.61765 15.1062 1.54049 14.759Z"
                    fill={pathname == "/playground" ? "#727191" : "#B7ABFF"}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 3.89583C0 7.10405 0.687614 7.79167 3.89583 7.79167C7.10405 7.79167 7.79167 7.10405 7.79167 3.89583C7.79167 0.687614 7.10405 0 3.89583 0C0.687614 0 0 0.687614 0 3.89583ZM1.41667 3.89583C1.41667 4.66555 1.45976 5.1874 1.54049 5.55068C1.61765 5.89787 1.70915 6.00768 1.74657 6.0451C1.78399 6.08252 1.8938 6.17401 2.24099 6.25117C2.60426 6.33191 3.12611 6.375 3.89583 6.375C4.66555 6.375 5.1874 6.33191 5.55068 6.25117C5.89787 6.17401 6.00768 6.08252 6.0451 6.0451C6.08252 6.00768 6.17401 5.89787 6.25117 5.55068C6.33191 5.1874 6.375 4.66555 6.375 3.89583C6.375 3.12611 6.33191 2.60426 6.25117 2.24099C6.17401 1.8938 6.08252 1.78399 6.0451 1.74657C6.00768 1.70915 5.89787 1.61765 5.55068 1.54049C5.1874 1.45976 4.66555 1.41667 3.89583 1.41667C3.12611 1.41667 2.60426 1.45976 2.24099 1.54049C1.8938 1.61765 1.78399 1.70915 1.74657 1.74657C1.70915 1.78399 1.61765 1.8938 1.54049 2.24099C1.45976 2.60426 1.41667 3.12611 1.41667 3.89583Z"
                    fill={pathname == "/playground" ? "#727191" : "#B7ABFF"}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.20833 13.1042C9.20833 16.3124 9.89595 17 13.1042 17C16.3124 17 17 16.3124 17 13.1042C17 9.89595 16.3124 9.20833 13.1042 9.20833C9.89595 9.20833 9.20833 9.89595 9.20833 13.1042ZM10.625 13.1042C10.625 13.8739 10.6681 14.3957 10.7488 14.759C10.826 15.1062 10.9175 15.216 10.9549 15.2534C10.9923 15.2909 11.1021 15.3823 11.4493 15.4595C11.8126 15.5402 12.3344 15.5833 13.1042 15.5833C13.8739 15.5833 14.3957 15.5402 14.759 15.4595C15.1062 15.3823 15.216 15.2909 15.2534 15.2534C15.2909 15.216 15.3823 15.1062 15.4595 14.759C15.5402 14.3957 15.5833 13.8739 15.5833 13.1042C15.5833 12.3344 15.5402 11.8126 15.4595 11.4493C15.3823 11.1021 15.2909 10.9923 15.2534 10.9549C15.216 10.9175 15.1062 10.826 14.759 10.7488C14.3957 10.6681 13.8739 10.625 13.1042 10.625C12.3344 10.625 11.8126 10.6681 11.4493 10.7488C11.1021 10.826 10.9923 10.9175 10.9549 10.9549C10.9175 10.9923 10.826 11.1021 10.7488 11.4493C10.6681 11.8126 10.625 12.3344 10.625 13.1042Z"
                    fill={pathname == "/playground" ? "#727191" : "#B7ABFF"}
                  />
                </svg>
                <span className="text">The Inventory</span>
              </div>
            </div>
          </Link>
          <Link
            to="/playground"
            onClick={async () => {
              const account = await getActiveAccount();
              if (!account) {
                window.alert("Please Connect Your wallet To Play the Game");
                window.history.back();
              }
            }}
          >
            <div className="nav-btn" style={b()}>
              <div className="child">
                <svg
                  className="svg"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8173 6.22053C16.0542 6.22053 15.4356 5.60189 15.4356 4.83876C15.4356 4.07564 16.0542 3.457 16.8173 3.457C17.5805 3.457 18.1991 4.07564 18.1991 4.83876C18.1991 5.60189 17.5805 6.22053 16.8173 6.22053Z"
                    stroke="#727191"
                    strokeWidth="1.5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.39496 11.2341C3.39496 12.9553 3.48915 14.2362 3.70411 15.2034C3.91529 16.1537 4.22258 16.7069 4.58589 17.0702C4.9492 17.4335 5.50244 17.7408 6.45267 17.952C7.41994 18.1669 8.70075 18.2611 10.422 18.2611C12.1433 18.2611 13.4241 18.1669 14.3914 17.952C15.3416 17.7408 15.8949 17.4335 16.2582 17.0702C16.6215 16.7069 16.9288 16.1537 17.1399 15.2034C17.3549 14.2362 17.4491 12.9553 17.4491 11.2341C17.4491 9.51279 17.3549 8.23198 17.1399 7.26471C17.116 7.15692 17.0908 7.05424 17.0644 6.95636C17.6023 6.89427 18.0793 6.63195 18.4188 6.24583C18.8099 7.47364 18.9491 9.09879 18.9491 11.2341C18.9491 18.2561 17.4441 19.7611 10.422 19.7611C3.39999 19.7611 1.89496 18.2561 1.89496 11.2341C1.89496 4.21202 3.39999 2.707 10.422 2.707C12.5573 2.707 14.1825 2.84616 15.4103 3.2373C15.0241 3.57681 14.7618 4.05375 14.6997 4.59167C14.6019 4.5653 14.4992 4.54011 14.3914 4.51615C13.4241 4.30118 12.1433 4.207 10.422 4.207C8.70075 4.207 7.41994 4.30118 6.45267 4.51615C5.50244 4.72733 4.9492 5.03461 4.58589 5.39793C4.22258 5.76124 3.91529 6.31448 3.70411 7.26471C3.48915 8.23198 3.39496 9.51279 3.39496 11.2341Z"
                    fill={pathname != "/playground" ? "#727191" : "#B7ABFF"}
                  />
                  <path
                    d="M6.15849 12.6552C6.15849 12.6552 8.12632 7.68112 10.422 11.2341C12.7178 14.787 14.6856 9.81289 14.6856 9.81289"
                    stroke="#727191"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text">The Playground</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="money-left">
          <div className="your">Your Balance</div>
          <div className="par">
            <div className="Tez">
              <AnimatedNumber
                value={xtz}
                formatValue={() => Number(xtz).toFixed(2)}
                duration={'400'}
              />
              {" XTZ"}
            </div>
            <div className="our-curr">
              <AnimatedNumber
                value={token}
                formatValue={() => Number(token).toFixed(0)}
                duration={'400'}
              />
              {" SPCOZ"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
