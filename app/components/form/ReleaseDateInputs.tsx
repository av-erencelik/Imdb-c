import { FormControl, FormLabel, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";

const ReleaseDateInputs = ({ searchParams, lte, gte }: { searchParams: URLSearchParams; lte: string; gte: string }) => {
  const [selectedMaxDate, setSelectedMaxDate] = useState(
    searchParams.get(lte) || new Date().toISOString().split("T")[0]
  );
  const [selectedMinDate, setSelectedMinDate] = useState(searchParams.get(gte) || "1850-01-01");
  return (
    <>
      <FormControl>
        <InputGroup display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel htmlFor={gte} m="0" mr="1">
            from:
          </FormLabel>
          <Input
            type="date"
            name={gte}
            id={gte}
            focusBorderColor="yellow.400"
            borderColor={"yellow.400"}
            size="sm"
            fontSize="sm"
            borderRadius="5px"
            w="125px"
            defaultValue={searchParams.get(gte) || ""}
            max={selectedMaxDate ? new Date(selectedMaxDate).toISOString().split("T")[0] : ""}
            _hover={{ borderColor: "yellow.400" }}
            onChange={(e) => setSelectedMinDate(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl>
        <InputGroup display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel htmlFor={lte} m="0" mr="1">
            to:
          </FormLabel>
          <Input
            type="date"
            name={lte}
            id={lte}
            focusBorderColor="yellow.400"
            borderColor={"yellow.400"}
            size="sm"
            fontSize="sm"
            w="125px"
            borderRadius="5px"
            defaultValue={searchParams.get(lte) || new Date().toISOString().split("T")[0]}
            min={selectedMinDate ? new Date(selectedMinDate).toISOString().split("T")[0] : ""}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedMaxDate(e.target.value)}
            _hover={{ borderColor: "yellow.400" }}
          />
        </InputGroup>
      </FormControl>
    </>
  );
};

export default ReleaseDateInputs;
