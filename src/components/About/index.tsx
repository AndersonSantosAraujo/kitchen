import { useContext } from "react";
import Loader from "../Loader";
import { Context } from "../../context/Context";

const About = () => {
  const { about, isAboutLoading } = useContext(Context);

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
