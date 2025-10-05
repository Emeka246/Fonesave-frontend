import { Button } from "@/components/ui/button";
import {  Mail } from "lucide-react";
export function GithubLogin(){
    return (
         <Button variant="outline" className="w-full">
            <Mail className="mr-2 size-5" />
            Continue with SSO
        </Button>
    )
}