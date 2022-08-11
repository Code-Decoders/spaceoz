import React, { useCallback, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Appbar from "./components/Appbar";
import photo from "./search.png"
import fil from "./filter.png"
import { Unity, useUnityContext } from 'react-unity-webgl';

export default function Playground() {
    const { unityProvider, isLoaded, unload, loadingProgression, addEventListener, removeEventListener, sendMessage, } = useUnityContext({
        loaderUrl: "build/Build.loader.js",
        dataUrl: "build/Build.data",
        frameworkUrl: "build/Build.framework.js",
        codeUrl: "build/Build.wasm",
        productName: "SpaceOz",
        companyName: "CodeDecoders"
    });

    const ref = useRef();

    const handleCoins = useCallback((val) => {
        console.log(val);
    }, []);

    const OnAppReady = useCallback(() => {
        var ships = [1, 2];
        var bullets = [6, 7];
        sendMessage("Coins", "GetShips", ships.join(","));
        sendMessage("Coins", "GetBullets", bullets.join(","));
        sendMessage("Coins", "GetUserCoins", 10);
    }, [sendMessage]);


    useEffect(() => {
        addEventListener("MintTokens", handleCoins);
        addEventListener("OnAppReady", OnAppReady);
        return () => {
            unload()
            removeEventListener("MintTokens", handleCoins);
            removeEventListener("OnAppReady", OnAppReady);
        }
    }, [addEventListener, removeEventListener, handleCoins, OnAppReady]);





    // We'll round the loading progression to a whole number to represent the
    // percentage of the Unity Application that has loaded.
    const loadingPercentage = Math.round(loadingProgression * 100);

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
                <div className="Middle" style={{ height: '100%' }}>
                    <div className="container">
                        {isLoaded === false && (
                            // We'll conditionally render the loading overlay if the Unity
                            // Application is not loaded.
                            <div className="loading-overlay">
                                <p>Loading... ({loadingPercentage}%)</p>
                            </div>
                        )}
                        <Unity ref={ref} className="unity" unityProvider={unityProvider} devicePixelRatio={16 / 9} style={{ height: 'calc(100vh - 135px)', aspectRatio: "16/9", overflow: "hidden" }} />
                    </div>
                </div>
            </div>
        </div >
    );
}