import { css } from "@emotion/react";
import S from "./Logo.module.scss";
import LogoSVG from "@assets/logo.svg";

const _css = css`
  font-size: 2em;
  font-family: var(--t-font-logo);
  padding: var(--t-spacing-lg) var(--t-spacing-md);
`;

const Logo = ({ size }: { size?: string }) => <LogoSVG scale={0.4} />;

export default Logo;
