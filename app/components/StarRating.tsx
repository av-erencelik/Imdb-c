import { MinusIcon } from "@chakra-ui/icons";
import { Container, IconButton, useToast } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import useFirstRender from "~/hooks/useFirstRender";

const StarRating = ({ isRated = 0 }: { isRated?: number }) => {
  const [rating, setRating] = useState(isRated);
  const [hover, setHover] = useState(isRated);
  const fetcher = useFetcher();
  const toast = useToast();
  const isFirstRender = useFirstRender();
  useEffect(() => {
    if (isFirstRender || fetcher.state === "loading") {
      return;
    }
    if (fetcher.state === "submitting") {
      toast({
        position: "top",
        title: "Submitting",
        status: "info",
        isClosable: true,
        duration: 1000,
      });
    } else if (fetcher.state === "idle" && rating) {
      toast({
        position: "top",
        title: `Your rating saved`,
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    } else {
      toast({
        position: "top",
        title: `Removed your rating`,
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    }
  }, [fetcher.state]);
  const rate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.id === `${rating}`) {
      return;
    }
    setRating(Number(e.currentTarget.id));
    fetcher.submit({ value: e.currentTarget.id, type: "rate" }, { method: "post" });
  };
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
          fetcher.submit({ value: "0", type: "rate" }, { method: "delete" });
        }}
      />
      {[...Array(10)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            id={`${index}`}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={rate}
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
