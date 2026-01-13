import {Check} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function ContactSuccessState({setIsSuccess}: { setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>}) {
    return(
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
            <Check size={32} />
        </div>
        <h3 className="text-2xl font-bold">Message Sent!</h3>
        <p className="text-muted-foreground">
            Thanks for reaching out. I’ll be in touch shortly to schedule
            your free call.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">
            Send another message
        </Button>
    </div>
    );
}