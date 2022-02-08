declare module "*.png" {
  const url: string;
  export default url;
}

declare module "*.svg" {
  const component: React.JSXElementConstructor<React.SVGAttributes<SVGElement>>;
  export default component;
}

declare module "*.module.scss";
