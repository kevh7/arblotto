import React from "react";
import { Button, Text, Flex } from '@chakra-ui/react';
import "./Dapp.css"
import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
      <div>
        <Flex height="60vh" align="center" justify="center">
              {/* Metamask network should be set to Localhost:8545. */}
              {networkError && (
                <NetworkErrorMessage 
                  message={networkError} 
                  dismiss={dismiss} 
                />
              )}
              <div>
                <Flex align="center" justify="center">
                  <Text fontSize="40px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">Connect a Wallet to Access ArbLotto</Text>
                </Flex>
                <Flex align="center" justify="center">
                  <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="30px 15px" onClick={connectWallet}>Connect Wallet</Button>
                </Flex>
              </div>
        </Flex>
    </div>
  );
}
