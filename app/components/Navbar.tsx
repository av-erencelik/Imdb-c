import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
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
} from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import Logo from "../../public/logo.png";

const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <Box as="nav" p="3" bg={"blackAlpha.800"}>
      <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
        <Flex justifyContent="space-between" alignItems={"center"}>
          <Link to="/home">
            <Image src={Logo} alt="Logo" w={{ base: "100px", md: "150px" }} objectFit="cover" />
          </Link>
          <Box display={{ base: "none", md: "block" }}>
            <Form method="post" action="/search">
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

                <Button type="submit" display="none" />
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
              >
                Movies
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"}>Lorem</MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
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
              >
                TV Shows
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"} _focus={{ bg: "gray.50" }}>
                  Lorem
                </MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
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
              >
                People
              </MenuButton>
              <MenuList minWidth={"150px"}>
                <MenuItem px={"6"}>Lorem</MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
                <MenuItem px={"6"}>Lorem</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
      {isSearching && (
        <Box display={{ base: "block", md: "none" }} mt="1">
          <Form method="post" action="/search">
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
