import css from "./Layout.module.css";
import { Link } from "wouter";
import { useLocale } from "../locale/locale.model.ts";
import { prefix } from "../utils.ts";

type Props = {
  children: any;
};

export function Layout({ children }: Props) {
  let t = useLocale();

  return (
    <div className={css.root}>
      <div className={css.navigation}>
        <img className={css.logo} alt="" />
        <Link to={prefix + "/"}>{t.new_puzzle}</Link>
        <Link to={prefix + "/settings"}>{t.setting}</Link>
      </div>
      <div className={css.content}>{children}</div>
    </div>
  );
}
