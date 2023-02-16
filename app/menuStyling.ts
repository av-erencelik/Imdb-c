import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(["menu", "item"]);

export const Menu = helpers.defineMultiStyleConfig({
  baseStyle: {
    item: {
      _focus: {
        bg: "gray.50",
      },
    },
  },
});
