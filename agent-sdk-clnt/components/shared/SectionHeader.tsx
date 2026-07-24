import { Button } from "@/components/ui/button";

interface Props{
    title:string;
    description?:string;
    action?:React.ReactNode;
}

export default function SectionHeader({
    title,
    description,
    action
}:Props){

    return(

        <div className="flex items-center justify-between">

            <div>

                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}

            </div>

            {action}

        </div>

    )

}