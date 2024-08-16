'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react";

import "/app/globals.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";


export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then(response => response.json())
            .then((data) => {
                setFlashcards(data);
            })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name.");
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with that name already exists.");
                return;
            }
            else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }

        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push("/flashcards");
    }


    // return (
    //     <div className="flex justify-center h-screen">
    //         <div className="max-w-xl w-full mt-4 mb-6 flex flex-col text-center">
    //             <text className="text-3xl">Generate Flashcards</text>
    //             <Card className="mt-4 p-4 w-full border-2 border-black">
    //                 <CardContent>
    //                     <Textarea
    //                         className="mb-2"
    //                         value={text}
    //                         onChange={(e) => setText(e.target.value)}
    //                         label="Text"
    //                         placeholder="Enter text"
    //                         rows={4}
    //                     >
    //                     </Textarea>
    //                     <Button
    //                         className="bg-orange-500 w-full"
    //                         onClick={handleSubmit}
    //                     >Submit</Button>
    //                 </CardContent>
    //             </Card>
    //         </div>

    //         {flashcards.length > 0 && (
    //             <div className="mt-4">
    //                 <text className="text-md">Flashcards Preview</text>
    //                 <div className="grid grid-cols-2 gap-4 mt-2">
    //                     {flashcards.map((flashcard, index) => (
    //                         <Card
    //                             key={index}
    //                             className="border-2 border-black"
    //                             onClick={() => handleCardClick(index)}
    //                         >
    //                             <div
    //                                 style={{
    //                                     perspective: '1000px', // Enable 3D space for child elements
    //                                 }}
    //                             >
    //                                 <div
    //                                     style={{
    //                                         transition: 'transform 0.65s',
    //                                         transformStyle: 'preserve-3d',
    //                                         position: 'relative',
    //                                         width: '100%',
    //                                         height: '200px',
    //                                         boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    //                                         transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0)',
    //                                     }}
    //                                 >
    //                                     <div
    //                                         style={{
    //                                             position: 'absolute',
    //                                             width: '100%',
    //                                             height: '100%',
    //                                             backfaceVisibility: 'hidden',
    //                                             display: 'flex',
    //                                             alignItems: 'center',
    //                                             justifyContent: 'center',
    //                                         }}
    //                                     >
    //                                         {flashcard.front}
    //                                     </div>
    //                                     <div
    //                                         style={{
    //                                             position: 'absolute',
    //                                             width: '100%',
    //                                             height: '100%',
    //                                             backfaceVisibility: 'hidden',
    //                                             display: 'flex',
    //                                             alignItems: 'center',
    //                                             justifyContent: 'center',
    //                                             transform: 'rotateY(180deg)',
    //                                         }}
    //                                     >
    //                                         {flashcard.back}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </Card>
    //                     ))}
    //                 </div>
    //             </div>

    //         )}

    //         <div className="justify-center mt-4 flex">
    //             <Button className="bg-orange-500" onClick={handleOpen}>Save</Button>
    //         </div>

    //         <Dialog open={open} onClose={handleClose}>
    //             <DialogContent>
    //                 <DialogTitle>Save Flashcards</DialogTitle>
    //                 <DialogDescription>Enter a name for your flashcard collection</DialogDescription>
    //                 <Textarea
    //                     autoFocus
    //                     type="text"
    //                     className="mb-2"
    //                     value={name}
    //                     onChange={(e) => setName(e.target.value)}
    //                     label="Collection Name"
    //                     placeholder="Enter name"
    //                 />
    //             </DialogContent>
    //             <DialogFooter>
    //                 <Button className="bg-orange-500" onClick={saveFlashcards}>Save</Button>
    //                 <Button className="bg-gray-500" onClick={handleClose}>Cancel</Button>
    //             </DialogFooter>
    //         </Dialog>
    //     </div>
    // )
    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="max-w-xl w-full mb-6">
                <text className="text-3xl text-center">Generate Flashcards</text>
                <Card className="mt-4 p-4 w-full border-2 border-black">
                    <CardContent>
                        <Textarea
                            className="mb-4"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Text"
                            placeholder="Enter text"
                            rows={4}
                        />
                        <Button
                            className="bg-orange-500 w-full"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {flashcards.length > 0 && (
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
            )}

            <div className="flex space-x-4 mt-6">
                <Button className="bg-orange-500" onClick={handleOpen}>Save</Button>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogDescription>Enter a name for your flashcard collection</DialogDescription>
                    <Textarea
                        autoFocus
                        type="text"
                        className="mb-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Collection Name"
                        placeholder="Enter name"
                    />
                    <DialogFooter>
                        <Button className="bg-orange-500" onClick={saveFlashcards}>Save</Button>
                        <Button className="bg-gray-500" onClick={handleClose}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )

}