import { MinusIcon } from "@chakra-ui/icons";
import { Container, IconButton } from "@chakra-ui/react";
import { useState } from "react";

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <Container display="flex" justifyContent="center" alignItems="center">
      <IconButton
        icon={<MinusIcon />}
        aria-label="delete"
        size="xs"
        borderRadius="full"
        mr="1"
        color="white"
        bg="transparent"
        _hover={{ opacity: 1 }}
        _active={{ opacity: 1 }}
        onClick={() => {
          setRating(0);
          setHover(0);
        }}
      />
      {[...Array(10)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </Container>
  );
};
export default StarRating;
