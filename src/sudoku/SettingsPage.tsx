import { Layout } from "./components/Layout.tsx";
import {
  $locale,
  localeChanged,
  narrowLocale,
  useLocale,
} from "./locale/locale.model.ts";
import { useUnit } from "effector-react";
import css from "./SettingsPage.module.css";
import { useState } from "react";
import { Switch } from "../ui/Switch/Switch.tsx";
import { RadioGroup } from "../ui/RadioGroup/RadioGroup.tsx";

export function SettingPage() {
  const [currentLocale] = useUnit([$locale]);
  let t = useLocale();

  const [highlights, setHighlights] = useState({
    rowsCols: false,
    currentNumber: false,
    lastSelected: false,
  });

  const handleHighlightToggle = (key) => {
    setHighlights((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const [showTime, setShowTime] = useState(false);

  return (
    <Layout>
      <div className={css.root}>
        <h2 className={css.title}>{t.setting}</h2>

        <div className={css.section}>
          <h3>{t.language}</h3>
          <RadioGroup
            value={currentLocale}
            options={[
              { label: "RU", value: "RU" },
              { label: "EN", value: "EN" },
            ]}
            onChange={(val) => localeChanged(val)}
          />
        </div>

        <div className={css.section}>
          <h3>Highlights</h3>
          <div className={css.checkboxGroup}>
            <Switch
              value={highlights.rowsCols}
              onChange={() => handleHighlightToggle("rowsCols")}
            >
              Rows + Columns + Box
            </Switch>
            <Switch
              value={highlights.currentNumber}
              onChange={() => handleHighlightToggle("currentNumber")}
            >
              Current Selected Number
            </Switch>
            <Switch
              value={highlights.lastSelected}
              onChange={() => handleHighlightToggle("lastSelected")}
            >
              Last Selected Number
            </Switch>
          </div>
        </div>

        <div className={css.section}>
          <h3>Display</h3>
          <Switch value={showTime} onChange={() => setShowTime(!showTime)}>
            Show Time
          </Switch>
        </div>
      </div>
    </Layout>
  );
}
