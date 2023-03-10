import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Container, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { redirect, type Request } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/react/dist/routeModules";
import { getUserInfos } from "~/auth.server";
export async function loader({ request }: { request: Request }) {
  const user = await getUserInfos(request);
  if (!user) {
    redirect("/home");
  }
  return { user };
}
const Profile = () => {
  const { user } = useLoaderData();
  return (
    <Box>
      <Box bg="yellow.400">
        <Container maxW="container.xl" py="5" display="flex" gap="5" alignItems="center">
          <Avatar
            src={`https://secure.gravatar.com/avatar/${user.avatar.gravatar.hash}.jpg?s=64`}
            size="xl"
            name={user.username}
          ></Avatar>
          <Text as="h2" fontSize="2xl" fontWeight="semibold">
            {user.username}
          </Text>
        </Container>
      </Box>
      <Box bg="blackAlpha.800">
        <Container maxW="container.xl" display="flex" justifyContent="center" alignItems="center">
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="transparent"
              color="yellow.400"
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
              px={{ base: 2, md: 4 }}
            >
              Favorites
            </MenuButton>
            <MenuList minWidth={"150px"} bg="yellow.400">
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/favorites/movie">Movies</Link>
              </MenuItem>
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/favorites/tv">Tv Shows</Link>
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="transparent"
              color="yellow.400"
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
              px={{ base: 2, md: 4 }}
            >
              Watchlist
            </MenuButton>
            <MenuList minWidth={"150px"} bg="yellow.400">
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/watchlist/movie">Movies</Link>
              </MenuItem>
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/watchlist/tv">Tv Shows</Link>
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="transparent"
              color="yellow.400"
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
              px={{ base: 2, md: 4 }}
            >
              Rated
            </MenuButton>
            <MenuList minWidth={"150px"} bg="yellow.400">
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/rated/movie">Movies</Link>
              </MenuItem>
              <MenuItem
                px={"6"}
                bg="transparent"
                _hover={{ bg: "yellow.300" }}
                _focus={{ bg: "yellow.300" }}
                fontWeight="semibold"
              >
                <Link to="/profile/rated/tv">Tv Shows</Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </Container>
      </Box>

      <Outlet />
    </Box>
  );
};
export const meta: MetaFunction = ({ data }) => {
  return {
    title: "Profile",
  };
};

export default Profile;
