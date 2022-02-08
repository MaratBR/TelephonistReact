import S from "./TextHeader.module.scss"

type TextHeaderProps = {
    title: React.ReactNode
    subtitle?: React.ReactNode    
}

export default function TextHeader({title, subtitle}: TextHeaderProps) {
    return <header className={S.header}> 
        <h2>{title}</h2>
        <span>{subtitle}</span>
    </header>
}