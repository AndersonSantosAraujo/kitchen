import { useState, useEffect, useCallback } from "react";
import { client } from "../../client";
import { Entry, EntrySkeletonType } from "contentful";
import CarouselSlide from "./CarouselSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loader from "../Loader";

interface IData {
  id: string;
  slideTitle: string;
  slideDescription: string;
  slideBg: string;
}

SwiperCore.use([Navigation]);

const Carousel = () => {
  const [isCarouselLoading, setIsCarouselLoading] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState<IData[]>([]);

  const cleanUpCarouselSlides = useCallback(
    (rawData: Entry<EntrySkeletonType, undefined, string>[]) => {
      const cleanSlides: IData[] = rawData.map((slide) => {
        const { sys, fields } = slide;
        const { id } = sys;
        const slideTitle = fields.title as string;
        const slideDescription = fields.description as string;
        const slideBg = (
          fields.image as {
            fields: {
              file: {
                url: string;
              };
            };
          }
        ).fields.file.url;

        const updatedSlide = { id, slideTitle, slideDescription, slideBg };

        return updatedSlide;
      });

      setCarouselSlides(cleanSlides);
    },
    [],
  );

  const getCarouselSlides = useCallback(async () => {
    setIsCarouselLoading(true);

    try {
      const response = await client.getEntries({
        content_type: "kitchenCarousel",
      });
      const responseData = response.items;

      if (responseData) cleanUpCarouselSlides(responseData);
      else setCarouselSlides([]);
      setIsCarouselLoading(false);
    } catch (error) {
      console.log(error);
      setIsCarouselLoading(false);
    }
  }, [cleanUpCarouselSlides]);

  useEffect(() => {
    getCarouselSlides();
  }, [getCarouselSlides]);

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
