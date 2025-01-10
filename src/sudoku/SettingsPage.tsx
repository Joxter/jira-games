import { Layout } from "./components/Layout.tsx";
import {
  $locale,
  localeChanged,
  narrowLocale,
  useLocale,
} from "./locale/locale.model.ts";
import { useUnit } from "effector-react";

export function SettingPage() {
  const [currentLocale] = useUnit([$locale]);
  let t = useLocale();

  return (
    <Layout>
      <h2>{t.setting}</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <p>{t.language}</p>
        <select
          value={currentLocale}
          onChange={(ev) => {
            // @ts-ignore
            const l = ev.target?.value;

            localeChanged(narrowLocale(l));
          }}
        >
          <option value={"ru"}>Русский</option>
          <option value={"en"}>English</option>
        </select>
      </div>
    </Layout>
  );
}
