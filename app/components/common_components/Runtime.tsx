import { Text } from "@chakra-ui/react";

const Runtime = ({ runtime }: { runtime: number }) => {
  return (
    <>
      {runtime ? (
        <Text>
          {Math.floor(runtime / 60)}h {runtime % 60}m
        </Text>
      ): null}
    </>
  );
};

export default Runtime;
