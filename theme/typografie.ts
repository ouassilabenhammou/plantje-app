import { fonts } from "./fonts";

export type Typography = {
  pageTitle: {
    fontSize: number;
    fontFamily: string;
  };
  sectionTitle: {
    fontSize: number;
    fontFamily: string;
  };
  body: {
    fontSize: number;
    fontFamily: string;
  };
  cardTitel: {
    fontSize: number;
    fontFamily: string;
  };
  subText: {
    fontSize: number;
    fontFamily: string;
  };
  label: {
    fontSize: number;
    fontFamily: string;
  };
  navbar: {
    fontSize: number;
    fontFamily: string;
  };
};

export const typography: Typography = {
  pageTitle: {
    fontSize: 25,
    fontFamily: fonts.bold,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: fonts.semiBold,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  cardTitel: {
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  subText: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  navbar: {
    fontSize: 11,
    fontFamily: fonts.medium,
  },
};
