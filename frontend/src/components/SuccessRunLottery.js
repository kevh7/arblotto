import { Flex, Text } from '@chakra-ui/react';
import "./Dapp.css"

const SuccessRunLottery = () => {

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="60vh">
            <Text fontSize="48px" width="60vw" fontFamily="VT323" textShadow="0 3px #000000">You have succesfully inititated the next lottery! You will get a small reward as compensation!</Text>
        </Flex>
    );
};

export default SuccessRunLottery;