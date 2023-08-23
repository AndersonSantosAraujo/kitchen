import { createContext, useCallback, useEffect, useState } from "react";
import { client } from "./client";
import { cleanUpAbout, cleanUpCarouselSlides } from "./helpers";
import { Entry, EntrySkeletonType } from "contentful";
import { IAbout, IContext, ISlides } from "../interfaces";

export const Context = createContext({} as IContext);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [about, setAbout] = useState<IAbout | null>();
  const [isAboutLoading, setIsAboutLoading] = useState(false);
  const [isCarouselLoading, setIsCarouselLoading] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState<ISlides[]>([]);

  const saveAboutData = useCallback(
    (rawData: Entry<EntrySkeletonType, undefined, string>) => {
      const cleanAboutData = cleanUpAbout(rawData);
      setAbout(cleanAboutData);
    },
    [],
  );

  const getAbout = useCallback(async () => {
    setIsAboutLoading(true);

    try {
      const response = await client.getEntry("7tQrWpRhV16lG3lpijJNTU");

      if (response) {
        saveAboutData(response);
      } else {
        setAbout(null);
      }

      setIsAboutLoading(false);
    } catch (error) {
      console.log(error);
      setIsAboutLoading(false);
    }
  }, [saveAboutData]);

  useEffect(() => {
    getAbout();
  }, [getAbout]);

  const saveCarouselData = useCallback(
    (rawData: Entry<EntrySkeletonType, undefined, string>[]) => {
      const cleanCarouselData = cleanUpCarouselSlides(rawData);
      setCarouselSlides(cleanCarouselData);
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

      if (responseData) saveCarouselData(responseData);
      else setCarouselSlides([]);
      setIsCarouselLoading(false);
    } catch (error) {
      console.log(error);
      setIsCarouselLoading(false);
    }
  }, [saveCarouselData]);

  useEffect(() => {
    getCarouselSlides();
  }, [getCarouselSlides]);

  const contextData = {
    about,
    isAboutLoading,
    isCarouselLoading,
    carouselSlides,
  };

  return <Context.Provider value={contextData}>{children}</Context.Provider>;
};
