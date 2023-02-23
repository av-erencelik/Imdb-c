import { Text } from "@chakra-ui/react";

const ReleaseDate = ({ date, textAlign = "initial" }: { date: string; textAlign?: any }) => {
  return (
    <Text textAlign={textAlign}>
      {new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </Text>
  );
};

export default ReleaseDate;
