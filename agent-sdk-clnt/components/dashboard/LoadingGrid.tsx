import LoadingCard from "./LoadingCard";

export default function LoadingGrid(){

    return(

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

            <LoadingCard/>
            <LoadingCard/>
            <LoadingCard/>
            <LoadingCard/>
            <LoadingCard/>
            <LoadingCard/>

        </div>

    )

}