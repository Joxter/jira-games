import css from "./Layout.module.css";
import { Link } from "wouter";

type Props = {
  children: any;
};

export function Layout({ children }: Props) {
  return (
    <div className={css.root}>
      <div className={css.navigation}>
        <img className={css.logo} alt="" />
        <Link to="/">new game</Link>
        <Link to="/settings">settings</Link>
      </div>
      <div className={css.content}>{children}</div>
    </div>
  );
}
