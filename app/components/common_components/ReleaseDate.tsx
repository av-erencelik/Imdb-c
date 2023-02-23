import { Text } from "@chakra-ui/react";

const ReleaseDate = ({ date }: { date: string }) => {
  return (
    <Text>
      {new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </Text>
  );
};

export default ReleaseDate;
