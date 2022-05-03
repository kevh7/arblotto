import { Box, Button, Flex, Text, HStack } from '@chakra-ui/react';
import "./Dapp.css"

const PrizePage = ( { account, runLottery, withdraw, getDeposited, getTotalPrizesWon, getEstimatedNextPrize, getLastLotteryTimestamp }) => {
    const isConnected = Boolean(account);

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
                    <Text fontSize="20px" marginBottom="2vh" textShadow="0 2px #000000">Today's Prize Pool (estimated)</Text>
                    <Text fontSize="30px" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">{getEstimatedNextPrize} DAI</Text>
                    <Text fontSize="20px" marginTop="2vh" textShadow="0 2px #000000">Next Winner Announced At: {getLastLotteryTimestamp}</Text>
                    <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="30px 15px" onClick={runLottery}>Run Lottery</Button>
                    <Text fontSize="20px" fontFamily="VT323" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Each day, the first person to click "Run Lottery" initiates the lottery for everyone and receives a small reward as compensation</Text>
                </div>
                {isConnected ? (
                    <div>
                        <HStack spacing="10vh" justify="center" marginTop="3vh">
                        <Box width="30vh" justify="center" align="center">
                            <Flex align="center" justify="center" marginTop="50px">
                                <Text fontSize="20px" marginBottom="2vh" marginLeft="10vh" marginRight="10vh" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Your Tickets' Value</Text>
                            </Flex>
                            <Flex align="center" justify="center">
                                <Text fontSize="30px" align="left" justify="left" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">{getDeposited} DAI</Text>
                            </Flex>
                        </Box>
                        <Box width="30vh" justify="center" align="center">
                            <Flex align="center" justify="center" marginTop="50px">
                                <Text fontSize="20px" marginBottom="2vh" marginLeft="10vh" marginRight="10vh" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">Your Prizes Won</Text>
                            </Flex>
                            <Flex align="center" justify="center">
                                <Text fontSize="30px" align="left" justify="left" letterSpacing="-5.5%" textShadow="0 2px 2px #000000">{getTotalPrizesWon} DAI</Text>
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