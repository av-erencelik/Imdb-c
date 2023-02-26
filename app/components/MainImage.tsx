import { Box, Text } from "@chakra-ui/react";
import Batman from "../../public/batman.jpg";
const MainImage = () => {
  return (
    <>
      <Box
        bgImage={Batman}
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
        borderBottomRadius="md"
      >
        <Text
          zIndex="20"
          color="yellow.400"
          fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
          textAlign="center"
          fontWeight="bold"
        >
          Lights, camera, action!
        </Text>
        <Text zIndex="20" color="yellow.400" fontSize="3xl" fontWeight="bold" display={{ base: "none", lg: "block" }}>
          Welcome to our Movies and TV shows database, where you'll find everything you need to stay up-to-date on the
          latest and greatest in the world of entertainment.
        </Text>
      </Box>
    </>
  );
};

export default MainImage;
