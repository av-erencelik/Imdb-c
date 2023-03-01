import { IconButton, Tooltip } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { type IconType } from "react-icons/lib";

const DeleteButton = ({ Icon, label, id }: { Icon: IconType; label: string; id: number }) => {
  const fetcher = useFetcher();
  return (
    <Tooltip label={label} hasArrow openDelay={250} letterSpacing="wide">
      <IconButton
        icon={<Icon />}
        size={"sm"}
        fontSize="15px"
        aria-label="delete"
        borderRadius="full"
        opacity={fetcher.state === "idle" ? "1" : "0.50"}
        colorScheme="red"
        onClick={() => fetcher.submit({ id: `${id}` }, { method: "post" })}
      ></IconButton>
    </Tooltip>
  );
};

export default DeleteButton;
