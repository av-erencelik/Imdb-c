import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
const BioTruncate = ({ biography }: { biography: string }) => {
  const [truncate, setTruncate] = useState(5);

  return (
    <>
      <Box>
        <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
          Biography
        </Text>
        {biography.length !== 0 ? (
          <Box px="3" pt="3" display="flex" justifyContent="center" flexDirection="column">
            <Text noOfLines={truncate}>{biography}</Text>
            {truncate !== 0 && (
              <IconButton
                variant="link"
                color="yellow.400"
                icon={<ChevronDownIcon boxSize={7} />}
                aria-label="down"
                size="sm"
                mx="auto"
                onClick={() => setTruncate(0)}
              ></IconButton>
            )}
          </Box>
        ) : (
          <Text textAlign="center" py="3">
            We don't have a biography for Yua Mikami.
          </Text>
        )}
      </Box>
    </>
  );
};

export default BioTruncate;
