import { Badge } from "@/components/ui/badge";

interface Props{
    status:"Running"|"Stopped"|"Deploying"|"Failed"
}

export default function StatusBadge({status}:Props){

    const variants={
        Running:"default",
        Deploying:"secondary",
        Failed:"destructive",
        Stopped:"outline",
    } as const;

    return(

        <Badge variant={variants[status]}>
            {status}
        </Badge>

    )

}