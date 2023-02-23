import { StarIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Menu, MenuButton, MenuList, Tooltip } from "@chakra-ui/react";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdWatchLater } from "react-icons/md";
import MainStatefulButton from "../buttons/MainStatefulButton";
import StarRating from "../StarRating";

const DetailsStickyFooter = ({
  account_states,
}: {
  account_states: { favorite: boolean; rated: false | { value: number }; watchlist: boolean };
}) => {
  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      position="fixed"
      left="0"
      bottom="0"
      bg="blackAlpha.800"
      color="white"
      zIndex="100"
      w="full"
      justifyContent="space-around"
      px="5"
    >
      <MainStatefulButton
        added={account_states ? account_states.favorite : false}
        Icon={AiFillHeart}
        type="favorites"
        label="Add to favorites"
        bg="transparent"
      />
      <MainStatefulButton
        added={account_states ? account_states.watchlist : false}
        Icon={MdWatchLater}
        type="watchlist"
        label="Watch later"
        bg="transparent"
      />
      <Menu offset={[64, 4]}>
        <Tooltip label="Rate it" hasArrow openDelay={250} letterSpacing="wide">
          <MenuButton
            as={IconButton}
            icon={<StarIcon />}
            bg="transparent"
            size={"md"}
            fontSize="15px"
            color={account_states?.rated ? "yellow.400" : "white"}
            aria-label="fav"
            borderRadius="full"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          ></MenuButton>
        </Tooltip>
        <MenuList minWidth={"150px"} bg="blackAlpha.800" border="none">
          <StarRating isRated={account_states?.rated ? account_states.rated.value : 0} />
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default DetailsStickyFooter;
