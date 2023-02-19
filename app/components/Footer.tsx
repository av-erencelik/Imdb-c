import { Box, Container, Flex, Image, Link, Text, Icon } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import tmbd from "../../public/tmdbLogo.png";
const Footer = () => {
  return (
    <Box as="footer" bg="blackAlpha.800" p="3">
      <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
        <Flex justifyContent="space-between" flexDirection={{ base: "column", md: "row" }} alignItems="center" gap="3">
          <Flex alignItems="center">
            <Text color="yellow.400">Created With </Text>
            <Link href="https://www.themoviedb.org/documentation/api" color="yellow.400" pl="2">
              <Image src={tmbd} w="90px"></Image>
            </Link>
          </Flex>
          <Flex alignItems="center">
            <Text color="yellow.400">Copyright © {new Date().getFullYear()} </Text>
            <Link href="https://github.com/av-erencelik" color="yellow.400" pl="1" display="flex" alignItems="center">
              av-erencelik <Icon as={FaGithub} color="yellow.400" ml="1" />
            </Link>
          </Flex>
          <Flex alignItems="center" color="yellow.400" gap="2">
            <Link href="https://www.linkedin.com/in/mehmet-eren-%C3%A7elik-6710b0222/">
              <Icon as={FaLinkedin} boxSize={5} />
            </Link>
            <Link href="https://www.instagram.com/ernmemo/">
              <Icon as={FaInstagram} boxSize={5} />
            </Link>
            <Link href="https://twitter.com/m_eren_celik">
              <Icon as={FaTwitter} boxSize={5} />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
