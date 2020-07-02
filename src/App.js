import React, { useState, useEffect } from "react";
import addresses from "./contracts/addresses";
import abis from "./contracts/abis";
import { ThemeProvider, CSSReset, Box, SimpleGrid, Image, Heading, Flex, Text, Link, Button, Tabs, Tab, TabList, TabPanels, TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,  } from "@chakra-ui/core"
import theme from "@chakra-ui/theme"
import "./App.css";

import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";
import Portis from "@portis/web3";
import Squarelink from "squarelink";
import Arkane from "@arkane-network/web3-arkane-provider";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import DcentProvider from "dcent-provider";

import CountDown from "./components/CountDown"
import Footer from "./components/Footer"
import Header from "./components/Header"


const INFURA_ID = "5335cfa53f7d487080f53f213e3b302c"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID // required
    }
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: "pk_live_522E2B32F46FB16A" // required
    }
  },
  torus: {
    package: Torus, // required
  },
  authereum: {
    package: Authereum // required
  },
  unilogin: {
    package: UniLogin // required
  },
  portis: {
    package: Portis, // required
    options: {
      id: "12f64063-f3e7-4bed-bb31-8c6dd697867b" // required
    }
  },
  squarelink: {
    package: Squarelink, // required
    options: {
      id: "88f1885b8489c400f03b" // required
    }
  },
  mewconnect: {
    package: MewConnect, // required
    options: {
      infuraId: INFURA_ID // required
    }
  }
};

function shortenDecimal(decimalString) {
  decimalString = decimalString.toString()
  if(!decimalString.includes('.')) return decimalString
  return decimalString.substring(0,decimalString.indexOf('.'))
}

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});



function App() {

  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'+INFURA_ID))
  const [web3, setWeb3] = useState(new Web3(provider))
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(1)
  const [networkId, setNetworkId] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [time, setTime] = useState(Date.UTC(2020,6,2,13,30,0,0))
  const [isActive, setIsActive] = useState((Date.now() > time))
  const [depositValue, setDepositValue] = useState(1)
  const [isDepositActive, setIsDepositActive] = useState(true)
  const [isRedeemActive, setIsRedeemActive] = useState(false)
  const [isUniswapSendActive, setIsUniswapSendActive] = useState(false)

  const [uniswapAsko, setUniswapAsko] = useState("24000000")
  const [presaleAsko, setPresaleAsko] = useState("40000000")
  const [uniswapEther, setUniswapEther] = useState("0")
  const [buybackEther, setBuybackEther] = useState("0")
  const [devfundEther, setDevfundEther] = useState("0")
  const [pctSoldOut, setPctSoldOut] = useState("0")
  const [totalPresaleEtherDeposited, setTotalPresaleEtherDeposited] = useState("0")

  const [accountDeposit, setAccountDeposit] = useState("0")
  const [isWhitelisted, setIsWhitelisted] = useState(false)

  const [askoPresaleSC, setAskoPresaleSC] = useState(null)
  const [askoTokenSC, setAskoTokenSC] = useState(null)

  const initWeb3 = async (provider) => {
    const web3 = new Web3(provider);

    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber
        }
      ]
    });

    return web3;
  }


  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAddress("")
    setWeb3(null)
    setProvider(null)
    setConnected(false)
    setChainId(1)
    setNetworkId(1)
    setShowModal(false)
  };

  const subscribeProvider = async (provider,web3) => {
      if (!provider.on) {
        return
      }
      provider.on("close", () => resetApp(web3));
      provider.on("accountsChanged", async (accounts) => {
        setAddress(accounts[0])
      });
      provider.on("chainChanged", async (chainId) => {
        const networkId = await web3.eth.net.getId()
        setChainId(chainId)
        setNetworkId(networkId)
      });
      provider.on("networkChanged", async (networkId) => {
        const chainId = await web3.eth.chainId();
        setChainId(chainId)
        setNetworkId(networkId)
      });
    };

  const onConnect = async () => {
    const provider = await web3Modal.connect()
    const web3 = await initWeb3(provider)
    await subscribeProvider(provider,web3)
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]
    const networkId = await web3.eth.net.getId()
    const chainId = await web3.eth.chainId()

    setConnected(true)
    setAddress(address)
    setChainId(chainId)
    setNetworkId(networkId)
    setProvider(provider)
    setWeb3(web3)
  }

  const handleDeposit = async () => {
    if(!web3 || !address || !askoPresaleSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(!isWhitelisted){
      alert("You are not whitelisted.")
    }
    await askoPresaleSC.methods.deposit().send({value:web3.utils.toWei(depositValue.toString(),"ether"),from:address})
    alert("Deposit sent. Check your wallet to see when it has confirmed.")
  }

  const handleRedeem = async () =>{
    if(!web3 || !address || !askoPresaleSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(!isWhitelisted){
      alert("You are not whitelisted.")
    }
    await askoPresaleSC.methods.redeem().send({from:address})
    alert("Deposit sent. Check your wallet to see when it has confirmed.")
  }

  const handleUniswap = async () =>{
    if(!web3 || !address || !askoPresaleSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    await askoPresaleSC.methods.sendToUniswap().send({from:address})
    alert("Deposit sent. Check your wallet to see when it has confirmed.")
  }

  useEffect(()=>{
    if(window.web3) onConnect()
  },[])

  useEffect(()=>{
    if(!web3) return
    if(!address) return

    const askoTokenSC = new web3.eth.Contract(abis.askoToken, addresses.askoToken)
    const askoPresaleSC = new web3.eth.Contract(abis.askoPresale, addresses.askoPresale)
    if (!askoTokenSC) return
    if (!askoPresaleSC) return

    let fetchData = async(web3,address,askoTokenSC,askoPresaleSC)=>{
      const [
        isWhitelisted,
        accountDeposit,
        buybackEther,
        devfundEther,
        uniswapEther,
        totalPresaleEtherDeposited,
        presaleAsko,
        uniswapAsko,
        hasSentToUniswap
      ] = await Promise.all([
        askoPresaleSC.methods.whitelist(address).call(),
        askoPresaleSC.methods.depositAccounts(address).call(),
        askoPresaleSC.methods.etherPoolBuyback().call(),
        askoPresaleSC.methods.etherPoolDevfund().call(),
        askoPresaleSC.methods.etherPoolUniswap().call(),
        askoPresaleSC.methods.totalPresaleEther().call(),
        askoPresaleSC.methods.totalPresaleTokens().call(),
        askoPresaleSC.methods.totalUniswapTokens().call(),
        askoPresaleSC.methods.hasSentToUniswap().call(),
      ])
      setUniswapAsko(web3.utils.fromWei(uniswapAsko))
      setPresaleAsko(web3.utils.fromWei(presaleAsko))
      setUniswapEther(web3.utils.fromWei(uniswapEther))
      setBuybackEther(web3.utils.fromWei(buybackEther))
      setDevfundEther(web3.utils.fromWei(devfundEther))
      setTotalPresaleEtherDeposited(totalPresaleEtherDeposited)
      setAccountDeposit(accountDeposit)
      setPctSoldOut(
        Math.floor(
          web3.utils.fromWei(
            web3.utils.toBN(totalPresaleEtherDeposited)
            .mul(web3.utils.toBN(web3.utils.toWei("100")))
            .div(web3.utils.toBN(web3.utils.toWei("200")))
          )
        )
      )
      setIsWhitelisted(isWhitelisted)

      if(web3.utils.toWei("200","ether").toString() == totalPresaleEtherDeposited.toString()){
        //presale ended
        setIsDepositActive(false)
        if(!hasSentToUniswap){
          setIsUniswapSendActive(true)
        }else{
          setIsRedeemActive(true)
        }
      }
    }

    fetchData(web3,address,askoTokenSC,askoPresaleSC)

    let interval;
    if(window.web3){
      interval = setInterval(()=>{
        fetchData(web3,address,askoTokenSC,askoPresaleSC)
      },1500)
    }else{
      interval = setInterval(()=>{
        fetchData(web3,address,askoTokenSC,askoPresaleSC)
      },5000)
    }

    setAskoTokenSC(askoTokenSC)
    setAskoPresaleSC(askoPresaleSC)

    return (interval)=>clearInterval(interval)

  },[web3,address])

  useEffect(()=>{
    if(Date.now() < time){
      let interval = setInterval(()=>{
        setIsActive(Date.now() > time)
      },500)
      return (interval)=>clearInterval(interval)
    }
  },[time])


  return (
    <ThemeProvider theme={theme} >
      <CSSReset />
      <Box w="100%" minH="100vh" bg="gray.800" color="gray.100" position="relative"  p="20px" pb="160px" >
        <Header web3={web3} address={address} onConnect={onConnect} />
        { isWhitelisted ? (
          <>
          <Text mb="40px" mt="40px" color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
            Whitelisted Account Detected.
          </Text>
          </>
        ) : address ?
            (
            <Text mb="40px" mt="40px" color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
              Account not whitelisted.
            </Text>
          ) : (
            <Text mb="40px" mt="40px" color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
              Account not connected.
            </Text>
          )
        }
          <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>

        { isActive ?
          (<><Box m="60px" ml="auto" mr="auto" textAlign="center">
              <NumberInput isDisabled={!isDepositActive} clampValueOnBlur={true} display="inline-block" value={depositValue} min={0} max={5} precision={2} w="100px" m="20px" ml="auto" mr="auto" color="gray.700" >
                <NumberInputField type="number" bg="gray.200" onChange={e => {setDepositValue(e.target.value)}} />
                <NumberInputStepper>
                <NumberIncrementStepper onClick={()=>{(depositValue<=4) ? setDepositValue(depositValue+1) : setDepositValue(5)}} />
                <NumberDecrementStepper onClick={()=>{(depositValue>=1) ? setDepositValue(depositValue-1) : setDepositValue(0)}} />
              </NumberInputStepper>
              </NumberInput>
              <Button fontSize="xs" color="gray.300" isDisabled={!isDepositActive} display="inline-block"  bg="gray.700" fg="gray.300" p="0px" h="25px" w="25px" m="10px" minWidth="0px" mb="12px" onClick={()=>{
                if(!web3) return
                const accountRemaining = web3.utils.toBN(web3.utils.toWei("5")).sub(web3.utils.toBN(accountDeposit))
                const totalReamaining = web3.utils.toBN(web3.utils.toWei("200")).sub(web3.utils.toBN(totalPresaleEtherDeposited))
                if(accountRemaining <= totalReamaining){
                  setDepositValue(web3.utils.fromWei(accountRemaining))
                }else{
                  setDepositValue(web3.utils.fromWei(totalReamaining))
                }
              }}>ᐱ</Button>
              <Button color="gray.300" isDisabled={!isDepositActive} display="block" ml="auto" mr="auto" onClick={handleDeposit} bg="green.700" fg="gray.200">Deposit</Button>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" mb="10px" textAlign="center">
                {(depositValue <= 5 && depositValue > 0 ) ?
                  (<>
                    Receive {shortenDecimal(depositValue * 200000 )} ASKO
                  </>) : (<>
                    Invalid. Must be between 0 and 5 ether.
                  </>)
                }
              </Text>
              <Text m="10px" color="gray.600"  ml="auto" mr="auto" textAlign="center" fontSize="sm">
                you have deposited <Text fontSize="md" color="gray.500" display="inline">{Number(web3.utils.fromWei(accountDeposit)).toPrecision(3)}</Text> ether of 5 max.
              </Text>
            </Box>
            <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
            <Box m='60px' ml="auto" mr="auto" textAlign="center">
              {!isRedeemActive && (
                <Text m="10px" color="gray.600"  ml="auto" mr="auto" textAlign="center" fontSize="sm">redeem opens when presale is sold out</Text>
              )}
              <Button isDisabled={!isRedeemActive} display="block" ml="auto" mr="auto" onClick={handleRedeem} bg="teal.700" fg="gray.200">Redeem</Button>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" mb="20px" textAlign="center">
                {web3.utils.fromWei(web3.utils.toBN(accountDeposit).mul(web3.utils.toBN("200000")))} ASKO
              </Text>
            </Box>
            <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
            <Box m='60px' ml="auto" mr="auto" textAlign="center">
              <Text color="gray.500" display="block" fontSize="2xl" p="10px" pb="0px" textAlign="center">
                Presale Stats
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
                Uniswap ASKO: {uniswapAsko}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Presale ASKO: {presaleAsko}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Uniswap Ether: {uniswapEther}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
                Devfund Ether: {devfundEther}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Buyback Ether: {buybackEther}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Pct sold out: {pctSoldOut} %
              </Text>
              <Text m="10px" color="gray.600" mt="20px" ml="auto" mr="auto" textAlign="center" fontSize="sm" mb="-10px">called once by anyone once presale is over</Text>
              <Text m="10px" color="gray.600"  ml="auto" mr="auto" textAlign="center" fontSize="sm">sends asko+ether to uniswap and unlocks redeem</Text>
              <Button isDisabled={!isUniswapSendActive} display="block" ml="auto" mr="auto" onClick={handleUniswap} bg="yellow.700" fg="gray.200">Uniswap</Button>
            </Box>
          </>) :
          (<Box mt="30vh">
            <Text ml="auto" mr="auto" textAlign="center" fontSize="sm">presale opens in</Text>
            <CountDown expiryTimestamp={time}  />
          </Box>)
        }
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
