import { useState } from 'react';
import { Box, Button, Flex, Input, Text, HStack } from '@chakra-ui/react';
import "./Dapp.css"

const PrizePage = ( { account, runLottery, withdraw }) => {
    const isConnected = Boolean(account);

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
                    <Text fontSize="20px" marginBottom="2vh" textShadow="0 2px #000000">Today's Prize Pool</Text>
                    <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">11 USDC</Text>
                    <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="30px 15px" onClick={runLottery}>Run Lottery</Button>
                    <Text fontSize="20px" fontFamily="VT323" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Each day, the first person to click "Run Lottery" runs the lottery for everyone and receives a small reward as compensation</Text>
                </div>
                {isConnected ? (
                    <div>
                        <HStack spacing="10vh" justify="center" marginTop="8vh">
                        <Box width="20vh" justify="center" align="center">
                            <Flex align="center" justify="center" marginTop="50px">
                                <Text fontSize="20px" marginBottom="2vh" marginLeft="10vh" marginRight="10vh" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Number of Tickets</Text>
                            </Flex>
                            <Flex align="center" justify="center">
                                <Text fontSize="30px" align="left" justify="left" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">3</Text>
                            </Flex>
                        </Box>
                        <Box width="20vh" justify="center" align="center">
                            <Flex align="center" justify="center" marginTop="50px">
                                <Text fontSize="20px" marginBottom="2vh" marginLeft="10vh" marginRight="10vh" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Your Prize Balance</Text>
                            </Flex>
                            <Flex align="center" justify="center">
                                <Text fontSize="30px" align="left" justify="left" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">3 USDC</Text>
                            </Flex>
                        </Box>
                        <Box width="20vh" justify="center" align="center">
                            <Flex align="center" justify="center" marginTop="50px">
                                <Text fontSize="20px" marginBottom="2vh" marginLeft="10vh" marginRight="10vh" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Your Total Balance</Text>
                            </Flex>
                            <Flex align="center" justify="center">
                                <Text fontSize="30px" align="left" justify="left" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">6 USDC</Text>
                            </Flex>
                        </Box>
                        </HStack>
                        <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="30px 15px" onClick={withdraw}>Withdraw Balance</Button>
                    </div>
                ) : (
                    <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">You Must Connect A Wallet View and Withdraw Your Prizes</Text>
                )}
            </Box>
        </Flex>
    );
};

export default PrizePage;