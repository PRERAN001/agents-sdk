import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCard(){

    return(

        <div className="space-y-4 rounded-xl border p-6">

            <Skeleton className="h-5 w-40"/>

            <Skeleton className="h-4 w-full"/>

            <Skeleton className="h-4 w-3/4"/>

            <Skeleton className="h-10 w-full"/>

        </div>

    )

}