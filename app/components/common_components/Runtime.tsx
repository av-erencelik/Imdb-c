import { Text } from "@chakra-ui/react";

const Runtime = ({ runtime }: { runtime: number[] }) => {
  return (
    <Text>
      {Math.floor(runtime[0] / 60)}h {runtime[0] % 60}m
    </Text>
  );
};

export default Runtime;
