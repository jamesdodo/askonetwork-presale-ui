import React from 'react';
import { Text, Box, Flex, Image, Heading, Button } from "@chakra-ui/core"
import Blockie from "./Blockie"

export default function Header({web3, address, onConnect}) {

  return (
    <>
    <Flex maxW="100vw" h="70px" align="center" >
      <Image src="/logo.png" alt="Askobar Logo" display="inline-block" m="20px" w="50px" h="50px" />
      <Heading as="h1" display="inline-block" mt="-10px">Askobar Presale</Heading>
      { (web3 && address) ?
        (<Box ml="auto" display="inline-block">
          <Blockie address={address} size={40} />
          <Text fontSize="xs">{address.substring(0, 6)}</Text>
        </Box>)
        :
        (<Button variant="solid" bg="teal.500" ml="auto" onClick={onConnect}>Connect</Button>)
      }
    </Flex>
    <Box width="90vw" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
    </>
  );
}
