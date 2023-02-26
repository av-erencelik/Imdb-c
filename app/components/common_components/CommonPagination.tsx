import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const CommonPagination = ({
  pages,
  pagesCount,
  currentPage,
  onPageChange,
}: {
  pages: number[];
  pagesCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPageChange}>
      <PaginationContainer w="full" justifyContent={"center"} pt="3" mt="auto" gap={1}>
        <PaginationPrevious colorScheme="yellow" p="0">
          <ChevronLeftIcon />
        </PaginationPrevious>
        <PaginationPageGroup justifyContent="center">
          {pages.map((page: number) => (
            <PaginationPage
              key={`pagination_page_${page}`}
              page={page}
              w={5}
              colorScheme="gray"
              bg="transparent"
              fontSize="sm"
              color="blackAlpha.800"
              _hover={{
                color: "yellow.400",
              }}
              _current={{
                w: 10,
                bg: "yellow.400",
                fontSize: "sm",
                color: "blackAlpha.800",
              }}
            />
          ))}
        </PaginationPageGroup>

        <PaginationNext colorScheme="yellow" p="0">
          <ChevronRightIcon />
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

export default CommonPagination;
