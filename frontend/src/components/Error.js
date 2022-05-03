import { Flex, Text } from '@chakra-ui/react';
import "./Dapp.css"

const Error = () => {

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="60vh">
            <Text fontSize="48px" width="60vw" fontFamily="VT323" textShadow="0 3px #000000">Sorry, the transaction failed. Please try again!</Text>
        </Flex>
    );
};

export default Error;