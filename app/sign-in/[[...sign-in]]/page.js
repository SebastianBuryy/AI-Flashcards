import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import "/app/globals.css";

export default function SignInPage() {
    return (
        <div className="w-full">
            <nav className="w-full">
                <div className="w-full bg-white shadow-xs mx-auto flex justify-between items-center py-4 px-6">
                    <div className="">
                        <h2 className="text-xl bg-gradient-to-r from-amber-500 to-pink-500 font-bold bg-clip-text text-transparent">Flashcard SaaS</h2>
                    </div>
                    <div className="space-x-2">
                        <Button asChild variant="outline" className="text-md border-black border-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <div className=" mt-20 flex flex-col items-center justify-center">
                <text className="text-3xl mb-6 font-bold">Sign In</text>
                <SignIn />
            </div>

        </div >
    );
}