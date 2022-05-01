import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
    Flex
  } from '@chakra-ui/react';
import "./Dapp.css"
import KevinImage from "../assets/blank.jpg"
import CharlesImage from "../assets/charlesimage.jpeg"

const TeamPage = ( { account }) => {

    return(
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="100vw">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000" marginBottom={"5vh"}>Team</Text>
                </div>
                <Center py={12}>
                    <Box
                        role={'group'}
                        p={6}
                        right={"100px"}
                        maxW={'330px'}
                        w={'full'}
                        bg={useColorModeValue('white', 'gray.800')}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                        rounded={'lg'}
                        mt={-12}
                        pos={'relative'}
                        height={'230px'}
                        _after={{
                            transition: 'all .3s ease',
                            content: '""',
                            w: 'full',
                            h: 'full',
                            pos: 'absolute',
                            top: 5,
                            left: 0,
                            backgroundImage: `url(${KevinImage})`,
                            filter: 'blur(15px)',
                            zIndex: -1,
                        }}
                        _groupHover={{
                            _after: {
                            filter: 'blur(20px)',
                            },
                        }}>
                        <Image
                            rounded={'lg'}
                            height={230}
                            width={282}
                            objectFit={'cover'}
                            src={KevinImage}
                        />
                        </Box>
                        <Stack pt={10} align={'center'}>
                        <Text color={'green'} fontSize={'lg'} textTransform={'uppercase'}>
                            Kevin
                        </Text>
                        <Text color={'green'} fontSize={'lg'} textTransform={'uppercase'}>
                            Huang
                        </Text>
                        <Stack direction={'row'} align={'center'}>
                            <Text color={'green.600'} fontSize={"sm"}>
                            CS @ Princeton '23
                            </Text>
                        </Stack>
                        </Stack>
                    </Box>
                    <Box
                        role={'group'}
                        p={6}
                        left={"100px"}
                        maxW={'330px'}
                        w={'full'}
                        bg={useColorModeValue('white', 'gray.800')}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                        rounded={'lg'}
                        mt={-12}
                        pos={'relative'}
                        height={'230px'}
                        _after={{
                            transition: 'all .3s ease',
                            content: '""',
                            w: 'full',
                            h: 'full',
                            pos: 'absolute',
                            top: 5,
                            left: 0,
                            backgroundImage: `url(${CharlesImage})`,
                            filter: 'blur(15px)',
                            zIndex: -1,
                        }}
                        _groupHover={{
                            _after: {
                            filter: 'blur(20px)',
                            },
                        }}>
                        <Image
                            rounded={'lg'}
                            height={230}
                            width={282}
                            objectFit={'cover'}
                            src={CharlesImage}
                        />
                        </Box>
                        <Stack pt={10} align={'center'}>
                        <Text color={'green'} fontSize={'lg'} textTransform={'uppercase'}>
                            Charles
                        </Text>
                        <Text color={'green'} fontSize={'lg'} textTransform={'uppercase'}>
                            Coppieters
                        </Text>
                        <Stack direction={'row'} align={'center'}>
                            <Text color={'green.600'} fontSize={"sm"}>
                            CS @ Princeton '23
                            </Text>
                        </Stack>
                        </Stack>
                    </Box>
                    </Center>
            </Box>
        </Flex>
    );
};

export default TeamPage;