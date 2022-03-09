import { useEffect, useState } from "react";
import { Contract, providers } from "ethers";
import "./App.css";
import NFT from "./contract/NFT.json";
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT;
console.log(NFT_CONTRACT_ADDRESS);

function App() {
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [date, setDate] = useState("");
  const [zodiacSign, setZodiacSign] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const connectWallet = async () => {
    const accountInfo = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accountInfo);
    if (!accountInfo || accountInfo.length === 0) {
      alert("Connect error");
      return;
    }
    if (accountInfo) {
      setAccount(accountInfo[0]);
    }
  };

  const initContract = () => {
    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
  }

  const mintNFT = async () => {
    setIsMinting(true);
    try {
      await NFTContract.mintNFT(account, zodiacSign);
    } catch (error) {
      console.log(error);
    } finally {
      setIsMinting(false);
    }
  }

  const calculateZodiacSign = (date) => {
    let dateObject = new Date(date);
    let day = dateObject.getDate();
    let month = dateObject.getMonth();
    if (month === 0) {
      if (day >= 20) {
        setZodiacSign("Aquarius");
      } else {
        setZodiacSign("Capricorn");
      }
    } else if (month === 1) {
      if (day >= 19) {
        setZodiacSign("Pisces");
      } else {
        setZodiacSign("Aquarius");
      }
    } else if (month === 2) {
      if (day >= 21) {
        setZodiacSign("Aries");
      } else {
        setZodiacSign("Pisces");
      }
    } else if (month === 3) {
      if (day >= 20) {
        setZodiacSign("Taurus");
      } else {
        setZodiacSign("Aries");
      }
    } else if (month === 4) {
      if (day >= 21) {
        setZodiacSign("Gemini");
      } else {
        setZodiacSign("Taurus");
      }
    } else if (month === 5) {
      if (day >= 21) {
        setZodiacSign("Cancer");
      } else {
        setZodiacSign("Gemini");
      }
    } else if (month === 6) {
      if (day >= 23) {
        setZodiacSign("Leo");
      } else {
        setZodiacSign("Cancer");
      }
    } else if (month === 7) {
      if (day >= 23) {
        setZodiacSign("Virgo");
      } else {
        setZodiacSign("Leo");
      }
    } else if (month === 8) {
      if (day >= 23) {
        setZodiacSign("Libra");
      } else {
        setZodiacSign("Virgo");
      }
    } else if (month === 9) {
      if (day >= 23) {
        setZodiacSign("Scorpio");
      } else {
        setZodiacSign("Libra");
      }
    } else if (month === 10) {
      if (day >= 22) {
        setZodiacSign("Sagittarius");
      } else {
        setZodiacSign("Scorpio");
      }
    } else if (month === 11) {
      if (day >= 22) {
        setZodiacSign("Capricorn");
      } else {
        setZodiacSign("Sagittarius");
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    calculateZodiacSign(date);
  }, [date]);

  useEffect(() => {
    if (!account) return;
    if (!window.ethereum) return;
    initContract();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.ethereum, account]);

  return (
    <div className="App">
      <header className="App-header">
        {isWalletInstalled && !account && (
          <button onClick={connectWallet}>Connect</button>
        )}
        {!isWalletInstalled && <p>Install MetaMask wallet</p>}
        {account && (
          <div>
            <h1>Connected as: {account}</h1>
          </div>
        )}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />
        <br />
        {zodiacSign ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
            viewBox="0 0 300 300"
            width="400px"
            height="400px"
          >
            <style>{`.base { fill: white; font-family: serif; font-size: 24px;`}</style>
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              class="base"
              dominant-baseline="middle"
              text-anchor="middle"
            >
              {zodiacSign}
            </text>
          </svg>
        ) : null}

        <br />
        <br />
        {account && <button isLoading={isMinting} onClick={mintNFT}>Mint</button>}
      </header>
    </div>
  );
}

export default App;
