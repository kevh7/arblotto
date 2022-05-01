import { useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

const MainLottery = ( { account, deposit, withdraw }) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const isConnected = Boolean(account);

    const handleDecrement = () => {
        if (depositAmount < 1) return;
        setDepositAmount(depositAmount - 1);
    }

    const handleIncrement = () => {
        setDepositAmount(depositAmount + 1);
    }

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000">ArbLotto</Text>
                    <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">A No-Loss Lottery on the Arbitrum Blockchain</Text>
                </div>
                {isConnected ? (
                    <div>
                        <Flex align="center" justify="center" marginTop="150px">
                            <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">How Many Tickets Would You Like to Buy?</Text>
                        </Flex>
                        <Flex align="center" justify="center">
                            <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">(1 Ticket = 1 USDC)</Text>
                        </Flex>
                        <Flex align="center" justify="center">
                            <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="18px 15px" onClick={handleDecrement}>-</Button>
                            <Input fontFamily="inherit" background="white" color="green" width="100px" height="40px" textAlign="center" paddingLeft="19px" marginTop="3px" type="number" value={depositAmount}/>
                            <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="18px 15px" onClick={handleIncrement}>+</Button>
                        </Flex>
                        <Button backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" margin="30px 15px" onClick={deposit}>Enter Lottery!</Button>
                    </div>
                ) : (
                    <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">You Must Connect A Wallet To Enter The Lottery</Text>
                )}
            </Box>
        </Flex>
    );
};

export default MainLottery;