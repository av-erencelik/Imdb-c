import { Text } from "@chakra-ui/react";

const Title = ({ title, date, textAlign = "inherit" }: { title: string; date: string; textAlign?: any }) => {
  return (
    <Text as="h2" fontSize="2xl" textAlign={textAlign}>
      <b>{title}</b> ({new Date(date).getFullYear()})
    </Text>
  );
};

export default Title;
