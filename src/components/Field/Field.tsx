import S from "./Field.module.scss"

type FieldProps = React.PropsWithChildren<{
    name: string
    description?: string
}>

export default function Field(props: FieldProps) {
    return <div className={S.root}>
        <div className={S.head}>
            <label>{props.name}</label>
            <span>{props.description}</span>
        </div>
        <div className={S.body}>
            {props.children}
        </div>
    </div>
}