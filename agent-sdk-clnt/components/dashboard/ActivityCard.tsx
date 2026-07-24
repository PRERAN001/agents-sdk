import { Card, CardContent } from "@/components/ui/card";

interface Props{
    title:string;
    subtitle:string;
    time:string;
}

export default function ActivityCard({
    title,
    subtitle,
    time
}:Props){

    return(

        <Card>

            <CardContent className="flex items-center justify-between p-5">

                <div>

                    <h3 className="font-medium">
                        {title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>

                </div>

                <span className="text-xs text-muted-foreground">
                    {time}
                </span>

            </CardContent>

        </Card>

    )

}