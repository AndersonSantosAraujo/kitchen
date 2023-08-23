export interface IAbout {
  id: string;
  aboutTitle: string;
  aboutContent: string | TrustedHTML;
  aboutImage: string;
}

export interface IContext {
  about: IAbout | null | undefined;
  isAboutLoading: boolean;
  isCarouselLoading: boolean;
  carouselSlides: ISlides[];
}

export interface ISlides {
  id: string;
  slideTitle: string;
  slideDescription: string;
  slideBg: string;
}
