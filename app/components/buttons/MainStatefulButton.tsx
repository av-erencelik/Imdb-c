import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { type IconType } from "react-icons/lib";
import useFirstRender from "~/hooks/useFirstRender";

const MainStatefulButton = ({
  added,
  type,
  Icon,
  label,
  bg = "blackAlpha.800",
}: {
  added: boolean;
  type: string;
  Icon: IconType;
  label: string;
  bg?: string;
}) => {
  const fetcher = useFetcher();
  const toast = useToast();
  const isFirstRender = useFirstRender();
  useEffect(() => {
    if (fetcher.data && fetcher.data.error) {
      toast({
        position: "top",
        title: "Something Happened",
        description: "Please try again later",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  }, [fetcher.data]);

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
    } else if (fetcher.state === "idle" && added && !fetcher.data.error) {
      toast({
        position: "top",
        title: `Added to ${type}`,
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    } else if (fetcher.state === "idle" && !fetcher.data.error) {
      toast({
        position: "top",
        title: `Removed from ${type}`,
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    }
  }, [fetcher.state]);
  return (
    <Tooltip label={label} hasArrow openDelay={250} letterSpacing="wide">
      <IconButton
        icon={<Icon />}
        bg={bg}
        size={"md"}
        fontSize="15px"
        color={added ? "yellow.400" : "white"}
        aria-label="fav"
        borderRadius="full"
        opacity={fetcher.state === "idle" ? "1" : "0.50"}
        _hover={{ bg: "blackAlpha.700" }}
        onClick={() => fetcher.submit({ fav: `${added}`, type: type }, { method: "post" })}
      ></IconButton>
    </Tooltip>
  );
};

export default MainStatefulButton;
