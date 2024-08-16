'use client';

import "/app/globals.css";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

export default function FlashcardPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams();
    const search = searchParams.get("id");

    useEffect(() => {
        async function getFlashcard() {
            if (!user || !search) return;
            const colRef = collection(doc(collection(db, "users"), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            })
            setFlashcards(flashcards);

        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <div></div>;
    }

    return (

        <div className="w-full flex flex-col items-center min-h-screen">
            {
                flashcards.length > 0 && (
                    <div className="max-w-4xl w-full">
                        <text className="text-md block mb-2">Flashcards Preview</text>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {flashcards.map((flashcard, index) => (
                                <Card
                                    key={index}
                                    className="border-2 border-black"
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div
                                        style={{
                                            perspective: '1000px', // Enable 3D space for child elements
                                        }}
                                    >
                                        <div
                                            style={{
                                                transition: 'transform 0.65s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {flashcard.front}
                                            </div>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transform: 'rotateY(180deg)',
                                                }}
                                            >
                                                {flashcard.back}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

