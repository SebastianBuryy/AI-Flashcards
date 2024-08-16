'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import "/app/globals.css";

export default function FlashcardsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                console.log(collections);
                setFlashcards(collections);
            }
            else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <div></div>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    return (
        <div className="w-full">
            <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {flashcards.map((flashcard, index) => (
                    <div key={index} className="bg-white shadow-md p-4 rounded-md cursor-pointer">
                        <Card className="border" onClick={() => handleCardClick(flashcard.name)}>
                            <CardContent>
                                <h3 className="text-xl font-bold">{flashcard.name}</h3>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );

}