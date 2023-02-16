import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import Logo from "../../public/logo.png";
const Navbar = () => {
  return (
    <Box as="nav" p="3" bg={"blackAlpha.800"}>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between">
          <Link to="/home">
            <Image src={Logo} alt="Logo" w="150px" objectFit="cover" />
          </Link>
          <Box>
            <Form>
              <FormControl>
                <Input type="text" placeholder="Search IMDB-C" />
              </FormControl>
            </Form>
          </Box>
          <Box display="flex" alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color="yellow.400"
                _hover={{ bg: "black" }}
                _active={{ bg: "black" }}
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
    </Box>
  );
};

export default Navbar;
