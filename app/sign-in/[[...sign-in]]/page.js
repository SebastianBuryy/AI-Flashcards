import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import "/app/globals.css";
import { TbCardsFilled } from "react-icons/tb";

export default function SignInPage() {
    return (
        <div className="w-full">
            <nav className="w-full">
                <div className="w-full bg-white shadow-xs mx-auto flex justify-between items-center py-4 px-6">
                    <div className="max-w-[300px] flex items-center space-x-2">
                        <Link className="flex items-center space-x-2" href="/">
                            <TbCardsFilled className="w-10 h-10 text-orange-500" />
                            <h2 className="text-xl text-black font-bold">Flashcard AI</h2>
                        </Link>
                    </div>
                    <div className="space-x-2">
                        <Button asChild variant="default" className="text-md font-bold">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="md:mt-36 md:mb-0 mb-20 mt-20 flex flex-col items-center justify-center">
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-orange-500 hover:bg-orange-400 text-white border-none rounded-full',
                            formFieldLabel: 'text-black font-bold',
                            dividerLine: 'bg-orange-500',
                            dividerText: 'text-black font-bold',
                            formFieldInput: 'hover:border-white border-2 border-orange-500',
                            cardBox: 'shadow-sm border-orange-500',
                        }
                    }}
                />
            </div>

        </div >
    );
}