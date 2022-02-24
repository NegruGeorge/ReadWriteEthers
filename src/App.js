import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import PGERC1155Abi from "./abis/PGERC1155.json";
import ConvertAbi from "./abis/Converter.json"
import PayableMinterAbi from "./abis/PayableMinterV2.json"



// const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/45e363fe")
// const signer = provider.getSigner();


// 
// 0x218DC3cc65fEE2fB78880dFC03032495388E9318


//  const PGERC1155Contract = new ethers.Contract(PGERC1155Address,PGERC1155Abi,provider);
//  const ConverterContract = new ethers.Contract(ConvertAbi,PGERC1155Abi,provider);
//  const PayableMinterContract = new ethers.Contract




function App() {
  const PGERC1155Address = "0x218DC3cc65fEE2fB78880dFC03032495388E9318"

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [PGERC1155Contract, setPGERC1155Contract] = useState(null);

  const [connectedAccount, setConnectedAccount] = useState("0x");
  const [contractOwner, setContractOwner] = useState("")
  const [balance, setBalance] = useState("0");

  const [minterRole,setMinterRole] = useState("");

  const connectWallet = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {

        setConnectedAccount(res[0])

        changeUserData();

      })
    } else {
      console.log("install Metamask")
    }
  }

  let changeUserData = () => {
    let prov = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(prov)
    setProvider(prov);

    let sign = prov.getSigner();
    setSigner(sign);

    let contract = new ethers.Contract(PGERC1155Address, PGERC1155Abi, sign);
    setPGERC1155Contract(contract)
  }


  let getOwner = async () => {
    console.log(provider)
    console.log(signer);
    console.log("ss")
    console.log(PGERC1155Contract)
   
    
    try {
      console.log("sss")
    let owner = await PGERC1155Contract.owner()
      console.log('ss')
      console.log(owner);
     
      setContractOwner(owner);
    } catch (err) {
      console.log(err)
    }


  }

  let getUserBalance = async () => {
    let bal = await PGERC1155Contract.balanceOf(connectedAccount, 1);

    console.log(bal.toString());
    setBalance(bal.toString());
  }

  let mintToken = async () => {
    console.log("sss")
    try {
      console.log('ss')
      await PGERC1155Contract.mintBatch(["0x7d0C85BeFe1097D615084e7774354eAbe5E811de"], 1, 2, "0x");
    } catch (err) {
      console.log(err)
    }
  }


  let checkMinterRole = async () =>{
    let role = await PGERC1155Contract.MINTER_ROLE();
    let check = await PGERC1155Contract.hasRole(role.toString(),connectedAccount);
    console.log(check)
    setMinterRole(check);
  }

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <h1>Account connected: {connectedAccount}</h1>

      <button onClick={getOwner}>getOwner</button>
      <button onClick={getUserBalance}>getUserBalance</button>
      <button onClick = {checkMinterRole}>Check Minter Role </button>
      <h3> { contractOwner==="" ? "" :  "contract owner " + contractOwner }</h3>
      <h3>user balance is : {balance}</h3>
      <h3>{minterRole==="" ? "": "user " + connectedAccount +" minter role status: " + minterRole}</h3>
      <button onClick={mintToken}>Mint 2 tokens</button>
    </div>
  );
}

export default App;
