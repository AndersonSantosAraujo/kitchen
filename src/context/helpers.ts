import { marked } from "marked";
import DOMPurify from "dompurify";
import { Entry, EntrySkeletonType } from "contentful";
import { ISlides } from "../interfaces";

export const getHTMLData = (rawData: string) => {
  const htmlString = marked(rawData);
  const sanitizedHTMLString = DOMPurify.sanitize(htmlString);
  return sanitizedHTMLString;
};

export const cleanUpAbout = (
  rawData: Entry<EntrySkeletonType, undefined, string>,
) => {
  const { sys, fields } = rawData;
  const { id } = sys;
  const aboutTitle = fields.title as string;
  const aboutContent = getHTMLData(fields.content as string);
  const aboutImage = (
    fields.image as {
      fields: {
        file: {
          url: string;
        };
      };
    }
  ).fields.file.url;
  const cleanAbout = { id, aboutTitle, aboutContent, aboutImage };

  return cleanAbout;
};

export const cleanUpCarouselSlides = (
  rawData: Entry<EntrySkeletonType, undefined, string>[],
) => {
  const cleanSlides: ISlides[] = rawData.map((slide) => {
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

  return cleanSlides;
};
