import { css } from "@emotion/react";
import { makeLayoutComponent } from "./layouts";
import img from "~src/assets/bg_texture.png"

const css_ = css`
    height: 100vh;
    display: grid;
    grid-template-columns: 30% 70%;
    
    & > aside {
        width: 30vw;
        background-image: url(${img});
        background-size: 600px;
    }

    & > main {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }
`

export default makeLayoutComponent(function Serenity(children) {
    return <div css={css_}>
        <aside />
        <main>
            {children}
        </main>
    </div>
})