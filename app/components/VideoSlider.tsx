import { Text } from "@chakra-ui/react";
import { useRef } from "react";
import Slider from "react-slick";
const VideoSlider = ({ videos }: { videos: Video[] }) => {
  const slider = useRef(null);
  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: false,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        Trailers
      </Text>
      <Slider {...settings} ref={slider}>
        {videos.map((video) => {
          return (
            <iframe
              width="384"
              height="216"
              src={`https://www.youtube.com/embed/${video.key}`}
              key={video.id}
              title={video.name}
              allowFullScreen
              loading="lazy"
            ></iframe>
          );
        })}
      </Slider>
    </>
  );
};

export default VideoSlider;
