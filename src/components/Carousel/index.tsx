import { useContext } from "react";
import CarouselSlide from "./CarouselSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loader from "../Loader";
import { Context } from "../../context/Context";

SwiperCore.use([Navigation]);

const Carousel = () => {
  const { isCarouselLoading, carouselSlides } = useContext(Context);

  if (isCarouselLoading) {
    return <Loader />;
  }

  if (!Array.isArray(carouselSlides) || !carouselSlides.length) {
    return null;
  }

  return (
    <div className="carousel">
      <Swiper navigation>
        {carouselSlides.map(({ id, slideBg, slideTitle, slideDescription }) => (
          <SwiperSlide key={id}>
            <CarouselSlide
              slideBg={slideBg}
              slideTitle={slideTitle}
              slideDescription={slideDescription}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
