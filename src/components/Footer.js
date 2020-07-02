import React from 'react';
import { Text, Box, Link } from "@chakra-ui/core"
import addresses from "../contracts/addresses";

export default function Footer() {

  return (
    <>

      <Box w="100%" minH="100px" bg="gray.800" color="gray.200" position="relative"  p="20px" pt="80px" textAlign="center" fontSize={{base:"sm", md:"md"}} >
        <Box width="90vw" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
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
    </>
  );
}
