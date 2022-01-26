import React from "react";
import { render } from "react-dom";

type LayoutProps = React.PropsWithChildren<{}>

export function makeLayoutComponent(render: (children: React.ReactNode) => React.ReactElement) {
    function Layout({children}: LayoutProps) {
        return render(children)
    }
    Layout.name = render.name 
    return Layout
}