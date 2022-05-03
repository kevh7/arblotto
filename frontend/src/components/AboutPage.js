import { useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import "./Dapp.css"

const AboutPage = ( { account }) => {
    const isConnected = Boolean(account);

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="85vw">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000">About</Text>
                    <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" marginTop="5vh" textShadow="0 4px 4px #000000">
                        ArbLotto is a decentralized "no-loss" lottery that operates as a dApp on the Ethereum Layer 2 Arbitrum. 
                        The motivation behind this protocol is to create a lottery that is accessible to everyone while also 
                        encouraging saving money.</Text>
                    <Text fontSize="48px" textShadow="0 5px #000000" marginTop="10vh">How It Works</Text>
                    <Flex marginTop="5vh" justify="center" align="center">
                        <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 4px 4px #000000">1.</Text>
                        <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 4px 4px #000000">Players buy tickets using DAI</Text>
                    </Flex>
                    <Flex justify="center" align="center">    
                        <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 4px 4px #000000">2.</Text>
                        <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 4px 4px #000000">Our smart contract stakes the collective funds in an external liquidity pool</Text>
                    </Flex>
                    <Flex justify="center" align="center">    
                        <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 4px 4px #000000">3.</Text>
                        <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 4px 4px #000000">The prize is determined by the interest made from staking</Text>
                    </Flex>
                    <Flex justify="center" align="center">    
                        <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 4px 4px #000000">4.</Text>
                        <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 4px 4px #000000">A winner is chosen at random daily and awarded the entire prize</Text>
                    </Flex>
                    <Flex justify="center" align="center">    
                        <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 4px 4px #000000">5.</Text>
                        <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 4px 4px #000000">Once the lottery is over, everyone can withdraw their funds!</Text>
                    </Flex>
                </div>
            </Box>
        </Flex>
    );
};

export default AboutPage;