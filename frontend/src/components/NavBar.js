import React from 'react';
import { Box, Button, Flex, Text, Spacer} from '@chakra-ui/react';

const NavBar = ({ account, connectWallet, homePage, prizesPage, aboutPage, teamPage }) => {
    const isConnected = Boolean(account)

    return (
        <Flex justify="space-between" align="center" padding="30px">
            <Flex justify="space-around" width="50%" padding="0 75px" />
            <Flex justify="space-around" align="center" width="50%" padding="30px">
                <Box margin="0 15px"><Text cursor="pointer" _hover={{ color: "green", stroke: "green" }} onClick={homePage}>Home</Text></Box>
                <Spacer />
                <Box margin="0 15px"><Text cursor="pointer" _hover={{ color: "green", stroke: "green" }} onClick={prizesPage}>Prizes</Text></Box>
                <Spacer />
                <Box margin="0 15px"><Text cursor="pointer" _hover={{ color: "green", stroke: "green" }} onClick={aboutPage}>About</Text></Box>
                <Spacer />
                <Box margin="0 15px"><Text cursor="pointer" _hover={{ color: "green", stroke: "green" }} onClick={teamPage}>Team</Text></Box>
                <Spacer />
                {isConnected ? (
                    <Box backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" padding="10px" color="white" margin="0 15px">Connected</Box>
                ) : (
                    <Box backgroundColor="green" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="10px" margin="0px 15px" onClick={connectWallet}>Connect Wallet</Box>
                )}
            </Flex>
        </Flex>
    );
};

export default NavBar;