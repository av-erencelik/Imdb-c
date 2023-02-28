import { Checkbox } from "@chakra-ui/react";

const GenreCheckbox = ({
  genre,
  searchParams,
}: {
  genre: { id: number; name: string };
  searchParams: URLSearchParams;
}) => {
  return (
    <Checkbox
      value={genre.id}
      colorScheme="yellow"
      name="genres"
      sx={{ color: "gray.400", "input:checked ~ span": { color: "blackAlpha.800" } }}
      size="sm"
      flex="47%"
      defaultChecked={searchParams.getAll("genres").includes(`${genre.id}`)}
    >
      {genre.name}
    </Checkbox>
  );
};

export default GenreCheckbox;
