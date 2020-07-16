import LocalizedStrings from "react-localization";
import { en } from "./en";
import { ru } from "./ru";

const dictionaries = {
    ru,
    en,
};

export const strings = new LocalizedStrings(dictionaries);
