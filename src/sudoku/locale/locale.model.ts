import { createEvent, restore } from "effector";
import { useUnit } from "effector-react";
import { ru } from "./ru";
import { en } from "./en";

type LocalDict = typeof ru;
en satisfies LocalDict;

const LS_KEY = "sudoku-locale-key";

export const localeChanged = createEvent<"en" | "ru">();
export const $locale = restore(localeChanged, getFromLS());

$locale.updates.watch((locale) => {
  saveToLS(locale);
});

export function useLocale() {
  const locale = useUnit($locale);

  if (locale === "ru") return ru;

  return en;
}

export function narrowLocale(it: any) {
  if (it === "ru") return "ru";

  return "en";
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
