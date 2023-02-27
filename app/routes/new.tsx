import { Checkbox, CheckboxGroup, Text } from "@chakra-ui/react";
import { useState } from "react";
const New = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreSelect = (selected) => {
    setSelectedGenres(selected);
  };
  return (
    <CheckboxGroup colorScheme="green" value={selectedGenres} onChange={handleGenreSelect}>
      {["Action", "Comedy", "Drama", "Horror"].map((genre) => (
        <Checkbox key={genre} value={genre} iconColor="transparent">
          {genre}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default New;
