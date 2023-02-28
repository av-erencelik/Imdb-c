import { FormControl, Select } from "@chakra-ui/react";

const SortSelect = ({
  searchParams,
  dateDesc,
  dateAsc,
}: {
  searchParams: URLSearchParams;
  dateDesc: string;
  dateAsc: string;
}) => {
  return (
    <FormControl>
      <Select
        placeholder="Sort"
        size="sm"
        name="sort_by"
        focusBorderColor="yellow.400"
        borderColor={"yellow.400"}
        borderRadius="5px"
        defaultValue={searchParams.get("sort_by") || ""}
      >
        <option value="popularity.desc">Popularity Descending</option>
        <option value="popularity.asc">Popularity Ascending</option>
        <option value={dateDesc}>Release Date Descending</option>
        <option value={dateAsc}>Release Date Ascending</option>
        <option value="vote_average.desc">Rating Descending</option>
        <option value="vote_average.asc">Rating Ascending</option>
      </Select>
    </FormControl>
  );
};

export default SortSelect;
