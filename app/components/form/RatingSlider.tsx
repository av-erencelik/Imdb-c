import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";

const RatingSlider = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const [sliderRange, setSliderRange] = useState<number[]>([]);
  const [showMark, setShowMark] = useState(false);
  return (
    <RangeSlider
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      aria-label={["min", "max"]}
      defaultValue={[Number(searchParams.get("min")) || 0, Number(searchParams.get("max")) || 10]}
      max={10}
      min={0}
      name={["min", "max"]}
      onChange={(val) => {
        setShowMark(true);
        setSliderRange(val);
      }}
      onChangeEnd={() => {
        setTimeout(() => {
          setShowMark(false);
        }, 1000);
      }}
    >
      <RangeSliderTrack bg="yellow.200">
        <RangeSliderFilledTrack bg="yellow.400" />
      </RangeSliderTrack>
      {showMark && (
        <RangeSliderMark
          value={2}
          textAlign="center"
          bg="yellow.400"
          color="blackAlpha.800"
          mt="5px"
          w="100px"
          borderRadius="md"
        >
          Rated {sliderRange[0]} - {sliderRange[1]}
        </RangeSliderMark>
      )}

      <RangeSliderThumb index={0} bg="blackAlpha.800" />
      <RangeSliderThumb index={1} bg="blackAlpha.800" />
    </RangeSlider>
  );
};

export default RatingSlider;
