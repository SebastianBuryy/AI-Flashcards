'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import React, { Fragment, useRef } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TbCardsFilled } from "react-icons/tb";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import PDFDownloadButton from '@/components/ui/memoizedbutton';


import "/app/globals.css";

export default function FlashcardsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState("");

    useEffect(() => {
        async function getDecks() {
            if (!user) return;
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setDecks(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getDecks();
    }, [user]);

    const handleCardClick = async (deckName) => {
        const colRef = collection(doc(collection(db, "users"), user.id), deckName);
        const docs = await getDocs(colRef);
        const flashcardsArray = [];

        docs.forEach((doc) => {
            flashcardsArray.push({ id: doc.id, ...doc.data() });
        });

        if (flashcardsArray.length > 0) {
            setSelectedDeck(deckName);
            setFlashcards(flashcardsArray);
            setCurrentIndex(0);
            setFlipped(false);
        }
    };

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#E4E4E4',
            padding: 10,
        },
        section: {
            flexDirection: 'row',
            margin: 10,
            padding: 0,
            borderBottom: '1px dotted #000',
            borderTop: '1px dotted #000',
        },
        question: {
            width: '50%',
            padding: 10,
            borderRight: '1px dotted #000',
            borderLeft: '1px dotted #000',
        },
        answer: {
            width: '50%',
            padding: 10,
            borderRight: '1px dotted #000',
        },
        questionText: {
            fontSize: 14,
        },
        answerText: {
            fontSize: 14,
        },
    });

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                {flashcards.map((flashcard, index) => (
                    <View style={styles.section} key={index}>
                        <View style={styles.question}>
                            <Text style={styles.questionText}>{flashcard.front}</Text>
                        </View>
                        <View style={styles.answer}>
                            <Text style={styles.answerText}>{flashcard.back}</Text>
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNextCard = () => {
        setAnimationDirection("next");
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
            setAnimationDirection("");
            setFlipped(false);
        }, 500);
    };

    const handlePrevCard = () => {
        setAnimationDirection("prev");
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
            setAnimationDirection("");
            setFlipped(false);
        }, 500);
    };

    if (!isLoaded || !isSignedIn) {
        return <div></div>;
    }

    return (
        <div className="w-full bg-orange-100">
            <nav className="w-full bg-white shadow-xs mx-auto flex justify-between items-center py-4 px-6">
                <div className="max-w-[300px] flex items-center space-x-2">
                    <Link className="flex items-center space-x-2" href="/">
                        <TbCardsFilled className="w-10 h-10 text-orange-500" />
                        <h2 className="text-xl text-black font-bold">Flashcard AI</h2>
                    </Link>
                </div>
                <div className="space-x-2">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <Button asChild variant="default" className="text-md font-bold">
                            <Link href="/sign-in">Login</Link>
                        </Button>
                        <Button asChild variant="default" className="text-md font-bold">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </SignedOut>
                </div>
            </nav>
            <div className="flex min-h-screen p-4">
                {/* Left column with flashcard decks */}
                <div className="w-1/6 bg-white p-4 shadow-xs border-2 border-orange-500 rounded-md">
                    <h3 className="text-xl font-bold text-center mb-4">Saved Flashcards</h3>
                    <div className="space-y-2">
                        <Button className="w-full rounded-lg">
                            <GoPlusCircle className="w-6 h-6 mr-2" />
                            <Link href="/generate" className="font-bold">New Flashcard</Link>
                        </Button>
                        {decks.map((deck, index) => (
                            <div
                                key={index}
                                className={`p-2 cursor-pointer border border-black hover:border-orange-500 rounded-lg ${selectedDeck === deck.name ? 'transition ease-in-out delay-0 duration-200 hover:border-orange-500 border-orange-500 border-2 shadow-xs' : ''}`}
                                onClick={() => handleCardClick(deck.name)}
                            >
                                <Card className="border-none">
                                    <CardContent>
                                        <h4 className="-ml-2 font-semibold">{deck.name}</h4>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column with flashcard details */}
                <div className="relative flex flex-col w-full ml-4 bg-white p-4 shadow-xs border-2 border-orange-500 rounded-md justify-center text-center items-center">
                    {selectedDeck ? (
                        <>
                            <div className="flex flex-grow max-w-xl w-full items-center mb-4">
                                {flashcards.length > 0 && (
                                    <div className="max-w-2xl w-full">
                                        <h3 className="text-2xl font-bold block mb-2 text-center">
                                            <span className="text-orange-500 font-semibold">Topic:</span> <br /> {selectedDeck}
                                        </h3>
                                        <hr className="w-28 mx-auto border-2 border-orange-500 mt-2 mb-4" />
                                        <Badge variant="outline" className="text-orange-500 border-2 border-orange-500 font-bold h-6 justify-center text-center mb-4">Simplified</Badge>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`relative w-full h-72 hover:cursor-pointer 
                                    ${animationDirection === 'next' ? 'animate-slideOutLeft' : ''} 
                                    ${animationDirection === 'prev' ? 'animate-slideOutRight' : ''}`}
                                                onClick={handleFlip}
                                            >
                                                <div
                                                    className={`absolute inset-0 
                                        ${animationDirection === 'next' ? 'animate-slideInRight' : ''} 
                                        ${animationDirection === 'prev' ? 'animate-slideInLeft' : ''}`}
                                                    style={{
                                                        transition: 'transform 0.65s',
                                                        transformStyle: 'preserve-3d',
                                                        width: '100%',
                                                        height: '100%',
                                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                                    }}
                                                >
                                                    <Card
                                                        className="absolute inset-0 shadow-md p-4"
                                                        style={{
                                                            backfaceVisibility: 'hidden',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {flashcards[currentIndex].front}
                                                    </Card>
                                                    <Card
                                                        className="absolute inset-0 shadow-sm p-4"
                                                        style={{
                                                            backfaceVisibility: 'hidden',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transform: 'rotateY(180deg)',
                                                        }}
                                                    >
                                                        {flashcards[currentIndex].back}
                                                    </Card>
                                                </div>
                                            </div>
                                            <div className="flex space-x-4 mt-4 items-center">
                                                <Button variant="default" size="icon" className="" onClick={handlePrevCard}>
                                                    <FaRegArrowAltCircleLeft className="w-6 h-6" />
                                                </Button>
                                                <span className="text-md font-bold">
                                                    {currentIndex + 1} / {flashcards.length}
                                                </span>
                                                <Button variant="default" size="icon" onClick={handleNextCard}>
                                                    <FaRegArrowAltCircleRight className="w-6 h-6" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="w-full mx-auto border border-black-100 mt-4 mb-2" />

                            <div className="mt-4 mb-4 relative w-full flex flex-col items-center min-h-screen">
                                <h3 className="text-2xl font-bold block mb-2 text-center">Question &amp; Answer</h3>
                                <hr className="w-28 mx-auto border-2 border-orange-500 mt-2 mb-4" />
                                <Badge variant="outline" className="text-orange-500 mb-4 border-2 border-orange-500 font-bold h-6 justify-center text-center items-center">Extended</Badge>
                                <PDFDownloadButton document={<MyDocument />} fileName={`${selectedDeck}.pdf`} />
                                {flashcards.length > 0 && (
                                    <div className="max-w-4xl w-full">
                                        <div className="grid grid-cols-2 gap-4">
                                            {flashcards.map((flashcard, index) => (
                                                <React.Fragment key={index}>
                                                    {/* Question Card */}
                                                    <Card className="transition ease-in-out delay-50 duration-200 shadow-md hover:shadow-sm">
                                                        <div
                                                            style={{
                                                                perspective: '1000px',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    position: 'relative',
                                                                    width: '100%',
                                                                    height: '200px',
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
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* Answer Card */}
                                                    <Card className="transition ease-in-out delay-50 duration-200 shadow-md hover:shadow-sm">
                                                        <div
                                                            style={{
                                                                perspective: '1000px',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    position: 'relative',
                                                                    width: '100%',
                                                                    height: '200px',
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
                                                                    {flashcard.back}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                            Select a flashcard deck to view its contents.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}