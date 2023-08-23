import { useCallback, useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { client } from "../../client";
import { Entry, EntrySkeletonType } from "contentful";
import Loader from "../Loader";

interface IData {
  id: string;
  aboutTitle: string;
  aboutContent: string | TrustedHTML;
  aboutImage: string;
}

const getHTMLData = (rawData: string) => {
  const htmlString = marked(rawData);
  const sanitizedHTMLString = DOMPurify.sanitize(htmlString);
  return sanitizedHTMLString;
};

const About = () => {
  const [about, setAbout] = useState<IData | null>();
  const [isAboutLoading, setIsAboutLoading] = useState(false);

  const cleanUpAbout = useCallback(
    (rawData: Entry<EntrySkeletonType, undefined, string>) => {
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

      setAbout(cleanAbout);
    },
    [],
  );

  const getAbout = useCallback(async () => {
    setIsAboutLoading(true);

    try {
      const response = await client.getEntry("7tQrWpRhV16lG3lpijJNTU");

      if (response) {
        cleanUpAbout(response);
      } else {
        setAbout(null);
      }

      setIsAboutLoading(false);
    } catch (error) {
      console.log(error);
      setIsAboutLoading(false);
    }
  }, [cleanUpAbout]);

  useEffect(() => {
    getAbout();
  }, [getAbout]);

  if (isAboutLoading) {
    return <Loader />;
  }

  return (
    <section className="about" id="about">
      <div className="row">
        <div className="column">
          <h2 className="titleText">{about?.aboutTitle}</h2>
          {about?.aboutContent && (
            <div dangerouslySetInnerHTML={{ __html: about?.aboutContent }} />
          )}
        </div>
        <div className="column">
          <div className="imgWrap">
            <img src={about?.aboutImage} alt={about?.aboutTitle} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
