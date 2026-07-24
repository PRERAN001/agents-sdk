interface ProjectsGridProps{
    children:React.ReactNode
}

export default function ProjectsGrid({
    children
}:ProjectsGridProps){

    return(

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

            {children}

        </div>

    )

}