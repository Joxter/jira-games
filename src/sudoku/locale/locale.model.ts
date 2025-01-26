import { createEvent, restore } from "effector";
import { useUnit } from "effector-react";
import { ru } from "./ru";
import { en } from "./en";

type LocalDict = typeof ru;
en satisfies LocalDict;

type Languages = "EN" | "RU";

const LS_KEY = "sudoku-locale-key";

export const localeChanged = createEvent<Languages>();
export const $locale = restore(localeChanged, getFromLS());

$locale.updates.watch((locale) => {
  saveToLS(locale);
});

export function useLocale() {
  const locale = useUnit($locale);

  if (locale === "RU") return ru;
  return en;
}

export function narrowLocale(it: any): Languages {
  if (it === "RU") return "RU";

  return "EN";
}

function getFromLS() {
  try {
    return narrowLocale(localStorage.getItem(LS_KEY));
  } catch (e) {
    console.log(e);
    return narrowLocale("en");
  }
}

function saveToLS(locale: string) {
  try {
    return localStorage.setItem(LS_KEY, locale);
  } catch (e) {
    console.log(e);
  }
}
