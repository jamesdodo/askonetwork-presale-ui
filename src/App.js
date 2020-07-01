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
import Blockie from "./components/Blockie"


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
  const [web3, setWeb3] = useState(null)
  const [provider, setProvider] = useState(null)
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(1)
  const [networkId, setNetworkId] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [blockie, setBlockie] = useState([])

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

    console.log("address:",address)

    setWeb3(web3)
    setProvider(provider)
    setConnected(true)
    setAddress(address)
    setChainId(chainId)
    setNetworkId(networkId)
  }

  useEffect(()=>{
    setBlockie(
      ""
    )
  },[address])

  useEffect(()=>{
    if(window.web3) onConnect()
  },[])

  //This will run every rerender of App. Intentional.
  const time = Date.UTC(2020,6,2,13,30,0,0)
  console.log(time)
  let isActive = false
  if (Date.now() > time )
    isActive = true

  return (
    <ThemeProvider theme={theme} >
      <CSSReset />
      <Box w="100%" minH="100vh" bg="gray.800" color="gray.100" position="relative"  p="20px" pb="160px" >
        <Flex maxW="100vw" h="70px" align="center" >
          <Image src="/logo.png" alt="Askobar Logo" display="inline-block" m="20px" w="50px" h="50px" />
          <Heading as="h1" display="inline-block" mt="-10px">Askobar Presale</Heading>
          { (web3 && address !== "") ?
            (<Box ml="auto" display="inline-block">
              <Blockie address={address} size={40} />
              <Text fontSize="xs">{address.substring(0, 6)}</Text>
            </Box>)
            :
            (<Button variant="solid" bg="teal.500" ml="auto" onClick={onConnect}>Connect</Button>)
          }
        </Flex>
        <Box width="90vw" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
        { isActive ?
          (<>

          </>) :
          (<Box mt="30vh">
            <Text ml="auto" mr="auto" textAlign="center" fontSize="sm">presale opens in</Text>
            <CountDown expiryTimestamp={time}  />
          </Box>)
        }
      </Box>
      <Box w="100%" minH="100px" bg="gray.800" color="gray.200" position="relative"  p="20px" pt="80px" textAlign="center" fontSize={{base:"sm", md:"md"}} >
        <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.askoToken}>Token SC</Link>
        <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.askoPresale}>Presale SC</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://github.com/joefilmo/askonetwork-contracts">Github</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://t.me/AskobarNetwork">Telegram</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://twitter.com/AskobarN">Twitter</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://medium.com/@AskobarNetwork">Medium</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://discord.gg/vpV3SdZ">Discord</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://www.reddit.com/u/AskobarNetwork">Reddit</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://www.facebook.com/askonetwork/">Facebook</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://www.instagram.com/askobarnetwork/">Instagram</Link>
        <Link color="gray.600" m="5px" display="inline-block" href="https://bitcointalk.org/index.php?topic=5258683">Bitcointalk</Link>
      </Box>
      <Box w="100%" minH="100px" pb="80px" bg="gray.800" color="gray.700" position="relative"  textAlign="center" >
        © 2020 Askobar Network. All rights reserved.
      </Box>
    </ThemeProvider>
  );
}

export default App;
