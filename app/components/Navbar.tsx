import { SearchIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import Logo from "../../public/logo.png";
import { Link as ChakraLink } from "@chakra-ui/react";

const Navbar = ({ user }: { user: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSearching, setIsSearching] = useState(false);
  return (
    <Box as="nav" p="3" bg={"blackAlpha.800"}>
      <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
        <Flex justifyContent="space-between" alignItems={"center"}>
          <Flex alignItems={"center"}>
            <Button
              onClick={onOpen}
              bg="transparent"
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
              display={{ base: "block", md: "none" }}
              px={{ base: 2, md: 4 }}
            >
              <HamburgerIcon color="yellow.400" boxSize={6} />
            </Button>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
              <DrawerOverlay />
              <DrawerContent bg={"#212020"} p="0" pt="40px">
                <DrawerCloseButton color="yellow.400" mb={"25px"} />

                <DrawerBody p={"0"}>
                  <Accordion allowToggle>
                    <AccordionItem border={"none"}>
                      <h2>
                        <AccordionButton
                          _hover={{ color: "yellow.100" }}
                          color="yellow.400"
                          _expanded={{ color: "yellow.100" }}
                          py="1"
                        >
                          <Box as="span" flex="1" textAlign="left" color="inherit">
                            Movies
                          </Box>
                          <AccordionIcon color="inherit" />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel p="0" color="yellow.400">
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/movie">Discover</Link>
                        </ChakraLink>
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/movie?sort_by=vote_average.desc">Top Rated</Link>
                        </ChakraLink>
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/movie?upcoming=true&page=1">Upcoming</Link>
                        </ChakraLink>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border={"none"}>
                      <h2>
                        <AccordionButton
                          _hover={{ color: "yellow.100" }}
                          color="yellow.400"
                          _expanded={{ color: "yellow.100" }}
                          py="1"
                        >
                          <Box as="span" flex="1" textAlign="left" color="inherit">
                            TV Shows
                          </Box>
                          <AccordionIcon color="inherit" />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel p="0" color="yellow.400">
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/tv">Discover</Link>
                        </ChakraLink>
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/tv?sort_by=vote_average.desc">Top Rated</Link>
                        </ChakraLink>
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/discover/tv?airing=true">On Air</Link>
                        </ChakraLink>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border={"none"} _expanded={{ border: "3px" }}>
                      <h2>
                        <AccordionButton
                          _hover={{ color: "yellow.100" }}
                          color="yellow.400"
                          _expanded={{ color: "yellow.100" }}
                          py="1"
                        >
                          <Box as="span" flex="1" textAlign="left" color="inherit">
                            People
                          </Box>
                          <AccordionIcon color="inherit" />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel p="0" color="yellow.400">
                        <ChakraLink
                          as="div"
                          width="100%"
                          display="block"
                          p="1"
                          pl="35px"
                          textStyle="none"
                          _hover={{ textStyle: "none", bg: "blackAlpha.400" }}
                          onClick={() => onClose()}
                        >
                          <Link to="/people/popular">Popular</Link>
                        </ChakraLink>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Link to="/home">
              <Image src={Logo} alt="Logo" w={{ base: "100px", md: "150px" }} objectFit="cover" />
            </Link>
          </Flex>

          <Box display={{ base: "none", md: "block" }}>
            <Form method="get" action="/search">
              <FormControl display="flex" borderColor={"yellow"} _hover={{ borderColor: "yellow" }}>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Search IMDB-C"
                    _placeholder={{ color: "yellow.100", fontSize: 14, opacity: 0.3 }}
                    name="search"
                    focusBorderColor="yellow.400"
                    borderColor={"yellow.400"}
                    _hover={{ borderColor: "yellow.400" }}
                    color="yellow.400"
                    _focus={{ bg: "blackAlpha.500" }}
                  />
                  <InputRightElement>
                    <SearchIcon color={"yellow.400"} />
                  </InputRightElement>
                </InputGroup>

                <Button type="submit" visibility="hidden" />
              </FormControl>
            </Form>
          </Box>
          <Box display="flex" alignItems={"center"}>
            <Button
              bg="transparent"
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
              display={{ md: "none", base: "block" }}
              px={{ base: 2, md: 4 }}
              onClick={() => setIsSearching(true)}
            >
              <SearchIcon color="yellow.400" cursor={"pointer"} />
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color="yellow.400"
                _hover={{ bg: "black" }}
                _active={{ bg: "black" }}
                px={{ base: 2, md: 4 }}
                display={{ md: "block", base: "none" }}
              >
                Movies
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"}>
                  <Link to="/discover/movie">Discover</Link>
                </MenuItem>
                <MenuItem px={"6"}>
                  <Link to="/discover/movie?sort_by=vote_average.desc">Top Rated</Link>
                </MenuItem>
                <MenuItem px={"6"}>
                  <Link to="/discover/movie?upcoming=true&page=1">Upcoming</Link>
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color="yellow.400"
                _hover={{ bg: "black" }}
                _active={{ bg: "black" }}
                px={{ base: 2, md: 4 }}
                display={{ md: "block", base: "none" }}
              >
                TV Shows
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"} _focus={{ bg: "gray.50" }}>
                  <Link to="/discover/tv">Discover</Link>
                </MenuItem>
                <MenuItem px={"6"}>
                  <Link to="/discover/tv?sort_by=vote_average.desc">Top Rated</Link>
                </MenuItem>
                <MenuItem px={"6"}>
                  <Link to="/discover/tv?airing=true">On Air</Link>
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color="yellow.400"
                _hover={{ bg: "black" }}
                _active={{ bg: "black" }}
                px={{ base: 2, md: 4 }}
                display={{ md: "block", base: "none" }}
              >
                People
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"}>
                  <Link to="/people/popular">Popular</Link>
                </MenuItem>
              </MenuList>
            </Menu>
            {!user ? (
              <Link to="/login">
                <Button
                  bg="transparent"
                  color="yellow.400"
                  _hover={{ bg: "black" }}
                  _active={{ bg: "black" }}
                  px={{ base: 2, md: 4 }}
                >
                  Login
                </Button>
              </Link>
            ) : (
              <Menu>
                <MenuButton as={Button} bg="transparent" _hover={{ bg: "transparent" }} _active={{ bg: "transparent" }}>
                  <Avatar
                    src={`https://secure.gravatar.com/avatar/${user.avatar.gravatar.hash}.jpg?s=64`}
                    size="sm"
                  ></Avatar>
                </MenuButton>
                <MenuList minWidth={"150px"}>
                  <MenuItem px={"6"}>
                    <Link to="/logout">Logout</Link>
                  </MenuItem>
                  <MenuItem px={"6"}>
                    <Link to="/profile/watchlist/movie">Profile</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
        </Flex>
      </Container>
      {isSearching && (
        <Box display={{ base: "block", md: "none" }} mt="1">
          <Form method="get" action="/search">
            <FormControl display="flex" borderColor={"yellow"} _hover={{ borderColor: "yellow" }}>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Search IMDB-C"
                  _placeholder={{ color: "yellow.100", fontSize: 14, opacity: 0.3 }}
                  name="search"
                  focusBorderColor="yellow.400"
                  borderColor={"yellow.400"}
                  _hover={{ borderColor: "yellow.400" }}
                  color="yellow.400"
                  _focus={{ bg: "blackAlpha.500" }}
                />
                <InputRightElement>
                  <CloseIcon color={"yellow.400"} onClick={() => setIsSearching(false)} />
                </InputRightElement>
              </InputGroup>

              <Button type="submit" display="none" />
            </FormControl>
          </Form>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
