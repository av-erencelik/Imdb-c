import { Box, Text } from "@chakra-ui/react";
import People from "../../public/people.webp";
const PeopleImage = () => {
  return (
    <Box
      bgImage={People}
      height={{ base: "200px", lg: "450px" }}
      maxW="container.xl"
      mx="auto"
      bgColor={"blackAlpha.600"}
      backgroundBlendMode="overlay"
      backgroundPosition={"top"}
      backgroundSize="cover"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems={{ base: "center", lg: "flex-start" }}
      px="50px"
      borderRadius="md"
    >
      <Text
        zIndex="20"
        color="yellow.400"
        fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
        textAlign="center"
        fontWeight="bold"
      >
        Discover!
      </Text>
      <Text zIndex="20" color="yellow.400" fontSize="3xl" fontWeight="bold" display={{ base: "none", lg: "block" }}>
        The talented people who bring your favorite movies and TV shows to life!
      </Text>
    </Box>
  );
};

export default PeopleImage;
