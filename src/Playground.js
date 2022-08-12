import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Appbar from "./components/Appbar";
import photo from "./search.png";
import fil from "./filter.png";
import { Unity, useUnityContext } from "react-unity-webgl";
import {
    getActiveAccount,
    getIGTContractStorage,
    getInventoryContractStorage,
    minSPZTokens,
} from "./adapters/tezos";
import BigNumber from "bignumber.js";

export default function Playground() {
    const {
        unityProvider,
        isLoaded,
        unload,
        loadingProgression,
        addEventListener,
        removeEventListener,
        sendMessage,
    } = useUnityContext({
        loaderUrl: "build/Build.loader.js",
        dataUrl: "build/Build.data",
        frameworkUrl: "build/Build.framework.js",
        codeUrl: "build/Build.wasm",
        productName: "SpaceOz",
        companyName: "CodeDecoders",
    });

    const [coins, setCoins] = useState(0);

    const [ships, setShips] = useState([]);
    const [bullets, setBullets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        var ids = [1, 2, 3, 4, 5, 6, 7, 8];
        var ships = [];
        var bullets = [];
        var account = await getActiveAccount();
        if (account) {
            var storage = await getIGTContractStorage();
            storage.ledger
                .get({
                    0: account.address,
                    1: "0",
                })
                .then((val) => {
                    var coins = BigNumber(val).toNumber();
                    setCoins(coins);
                });
        }

        var storage = await getInventoryContractStorage();

        for (const id in ids) {
            const item = ids[id];
            const owners = await storage.ledger.get(`${item}`);
            if (owners.find((e) => e === account.address)) {
                console.log(item);
                if (item < 6) ships.push(item);
                else bullets.push(item);
            }
        }
        setShips(ships);
        setBullets(bullets);
        setLoading(false);
    };

    const handleCoins = useCallback((val) => {
        console.log(val)
        getActiveAccount().then(account =>
            minSPZTokens(val, account.address));
    }, []);

    const OnAppReady = useCallback(() => {
        sendMessage("Coins", "GetUserCoins", coins);
        sendMessage("Coins", "GetShips", ships.join(","));
        sendMessage("Coins", "GetBullets", bullets.join(","));
    }, [sendMessage]);

    useEffect(() => {
        addEventListener("MintTokens", handleCoins);
        addEventListener("OnAppReady", OnAppReady);
        return () => {
            unload();
            removeEventListener("MintTokens", handleCoins);
            removeEventListener("OnAppReady", OnAppReady);
        };
    }, [addEventListener, removeEventListener, handleCoins, OnAppReady, unload]);

    // We'll round the loading progression to a whole number to represent the
    // percentage of the Unity Application that has loaded.
    const loadingPercentage = Math.round(loadingProgression * 100);

    return (
        <div className="playgame">
            <div className="left">
                <Navbar />
            </div>
            <div className="right">
                <div className="Top" style={{ position: "sticky" }}>
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
                <div className="Middle" style={{ height: "100%" }}>
                    <div className="container">
                        {isLoaded === false && (
                            // We'll conditionally render the loading overlay if the Unity
                            // Application is not loaded.
                            <div className="loading-overlay">
                                <p>Loading... ({loadingPercentage}%)</p>
                            </div>
                        )}
                        {!loading && (
                            <Unity
                                className="unity"
                                unityProvider={unityProvider}
                                style={{
                                    width: "calc(100% - 100px)",
                                    aspectRatio: "16/9",
                                    overflow: "hidden",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
