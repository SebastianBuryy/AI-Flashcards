// 'use client';

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Textarea } from "@/components/ui/textarea"
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { TbCardsFilled } from "react-icons/tb";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// import "/app/globals.css";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { db } from "@/firebase";
// import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";


// export default function Generate() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const [flipped, setFlipped] = useState([]);
//     const [text, setText] = useState("");
//     const [name, setName] = useState("");
//     const [open, setOpen] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async () => {
//         fetch('api/generate', {
//             method: 'POST',
//             body: text,
//         }).then(response => response.json())
//             .then((data) => {
//                 setFlashcards(data);
//             })
//     }

//     const handleCardClick = (id) => {
//         setFlipped((prev) => ({
//             ...prev,
//             [id]: !prev[id]
//         }))
//     }

//     const handleOpen = () => {
//         setOpen(true);
//     }

//     const handleClose = () => {
//         setOpen(false);
//     }

//     const saveFlashcards = async () => {
//         if (!name) {
//             alert("Please enter a name.");
//             return;
//         }

//         const batch = writeBatch(db);
//         const userDocRef = doc(collection(db, "users"), user.id);
//         const docSnap = await getDoc(userDocRef);

//         if (docSnap.exists()) {
//             const collections = docSnap.data().flashcards || [];
//             if (collections.find((f) => f.name === name)) {
//                 alert("Flashcard collection with that name already exists.");
//                 return;
//             }
//             else {
//                 collections.push({ name });
//                 batch.set(userDocRef, { flashcards: collections }, { merge: true });
//             }

//         } else {
//             batch.set(userDocRef, { flashcards: [{ name }] });
//         }

//         const colRef = collection(userDocRef, name);
//         flashcards.forEach((flashcard) => {
//             const cardDocRef = doc(colRef);
//             batch.set(cardDocRef, flashcard);
//         });

//         await batch.commit();
//         handleClose();
//         router.push("/flashcards");
//     }

//     return (
//         <div className="w-full">
//             <nav className="w-full">
//                 <div className="w-full bg-white shadow-xs mx-auto flex justify-between items-center py-4 px-6">
//                     <div className="max-w-[300px] flex items-center space-x-2">
//                         <Link className="flex items-center space-x-2" href="/">
//                             <TbCardsFilled className="w-10 h-10 text-orange-500" />
//                             <h2 className="text-xl text-black font-bold">Flashcard AI</h2>
//                         </Link>
//                     </div>
//                     <div className="space-x-2">
//                         <SignedIn>
//                             <UserButton />
//                         </SignedIn>
//                         <SignedOut>
//                             <Button asChild variant="default" className="text-md font-bold">
//                                 <Link href="/sign-in">Login</Link>
//                             </Button>
//                             <Button asChild variant="default" className="text-md font-bold">
//                                 <Link href="/sign-up">Sign Up</Link>
//                             </Button>
//                         </SignedOut>
//                     </div>
//                 </div>
//             </nav>

//             <div className="flex flex-col items-center min-h-screen p-4">
//                 <div className="max-w-xl w-full mb-6">
//                     <text className="text-3xl text-center">Generate Flashcards</text>
//                     <Card className="mt-4 p-4 w-full border-2 border-black">
//                         <CardContent>
//                             <Textarea
//                                 className="mb-4"
//                                 value={text}
//                                 onChange={(e) => setText(e.target.value)}
//                                 label="Text"
//                                 placeholder="Enter text"
//                                 rows={4}
//                             />
//                             <Button
//                                 className="bg-orange-500 w-full"
//                                 onClick={handleSubmit}
//                             >
//                                 Submit
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {flashcards.length > 0 && (
//                     <div className="max-w-4xl w-full">
//                         <text className="text-md block mb-2">Flashcards Preview</text>
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {flashcards.map((flashcard, index) => (
//                                 <Card
//                                     key={index}
//                                     className="border-2 border-black"
//                                     onClick={() => handleCardClick(index)}
//                                 >
//                                     <div
//                                         style={{
//                                             perspective: '1000px', // Enable 3D space for child elements
//                                         }}
//                                     >
//                                         <div
//                                             style={{
//                                                 transition: 'transform 0.65s',
//                                                 transformStyle: 'preserve-3d',
//                                                 position: 'relative',
//                                                 width: '100%',
//                                                 height: '200px',
//                                                 boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
//                                                 transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0)',
//                                             }}
//                                         >
//                                             <div
//                                                 style={{
//                                                     position: 'absolute',
//                                                     width: '100%',
//                                                     height: '100%',
//                                                     backfaceVisibility: 'hidden',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                 }}
//                                             >
//                                                 {flashcard.front}
//                                             </div>
//                                             <div
//                                                 style={{
//                                                     position: 'absolute',
//                                                     width: '100%',
//                                                     height: '100%',
//                                                     backfaceVisibility: 'hidden',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     transform: 'rotateY(180deg)',
//                                                 }}
//                                             >
//                                                 {flashcard.back}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </Card>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex space-x-4 mt-6">
//                     <Button className="bg-orange-500" onClick={handleOpen}>Save</Button>
//                 </div>

//                 <Dialog open={open} onClose={handleClose}>
//                     <DialogContent>
//                         <DialogTitle>Save Flashcards</DialogTitle>
//                         <DialogDescription>Enter a name for your flashcard collection</DialogDescription>
//                         <Textarea
//                             autoFocus
//                             type="text"
//                             className="mb-2"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             label="Collection Name"
//                             placeholder="Enter name"
//                         />
//                         <DialogFooter>
//                             <Button className="bg-orange-500" onClick={saveFlashcards}>Save</Button>
//                             <Button className="bg-gray-500" onClick={handleClose}>Cancel</Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//         </div>
//     )
// }

'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Link from "next/link";
import { TbCardsFilled } from "react-icons/tb";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import "/app/globals.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { db } from "@/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { Label } from "@radix-ui/react-label";

import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import { useDropzone } from "react-dropzone";
import { PDFDocument, getTextContent } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import Tesseract from 'tesseract.js';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [files, setFiles] = useState([]);

    // const handleSubmit = async () => {
    //     fetch('api/generate', {
    //         method: 'POST',
    //         body: text,
    //     }).then(response => response.json())
    //         .then((data) => {
    //             setFlashcards(data);
    //         });
    // };

    const handleSubmit = async () => {
        if (files.length > 0) {
            const file = files[0];
            const fileType = file.type;

            // Handle PDF files
            if (fileType === 'application/pdf') {
                const reader = new FileReader();

                reader.onload = async (event) => {
                    const typedArray = new Uint8Array(event.target.result);

                    // Use pdfjsLib to load and extract text from the PDF
                    const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
                    const textArray = await Promise.all(
                        pdfDoc._pdfInfo.numPages.map(async (pageNum) => {
                            const page = await pdfDoc.getPage(pageNum);
                            const textContent = await page.getTextContent();
                            return textContent.items.map(item => item.str).join(' ');
                        })
                    );
                    const extractedText = textArray.join(' ');

                    sendToBackend({ text: extractedText });
                };

                reader.readAsArrayBuffer(file);
            }
            // Handle image files (JPG, PNG)
            else if (fileType === 'image/jpeg' || fileType === 'image/png') {
                Tesseract.recognize(
                    file,
                    'eng',
                    {
                        logger: (m) => console.log(m), // Optional: Log Tesseract progress
                    }
                ).then(({ data: { text: extractedText } }) => {
                    sendToBackend({ text: extractedText });
                }).catch((error) => {
                    console.error('Error processing image:', error);
                });
            }
        } else {
            // If no files are uploaded, just send the text input
            sendToBackend({ text });
        }
    };

    // Helper function to send data to the backend
    const sendToBackend = (payload) => {
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then((data) => {
                setFlashcards(data);
            })
            .catch(error => {
                console.error('Error generating flashcards:', error);
            });
    };


    const handleCardClick = () => {
        setFlipped(!flipped);
    };

    const handleNextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setFlipped(false);
    };

    const handlePrevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setFlipped(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
            } else {
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
    };

    const onDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    // Configure the dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles);
        }
    });

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
                </div>
            </nav>

            <div className="flex flex-col items-center min-h-screen p-4 mt-12">
                <div className="max-w-xl w-full mb-6">
                    <h2 className="text-2xl font-bold text-center">Create Flashcards</h2>
                    <hr className="w-1/4 mx-auto border-2 border-orange-500 mt-2" />
                    <Card className="mt-4 p-4 w-full shadow-md">
                        <CardContent>
                            <Label className="text-md font-bold">Files</Label>
                            <div {...getRootProps()} className="mt-0 mb-2 p-4 border-dashed border-2 border-gray-300 rounded-lg text-center">
                                <input {...getInputProps()} />
                                <p>Drag and drop or <span className="font-bold text-orange-500">browse</span> to upload</p>
                                <p className="text-gray-400">PNG, JPG, PDF up to 10MB</p>
                            </div>
                            {files.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-lg font-bold">Uploaded Files</h4>
                                    <ul>
                                        {files.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <Label className="text-md font-bold">Text</Label>
                            <Textarea
                                className="mb-4 ring-black hover:ring-none focus:ring-none"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                label="Text"
                                placeholder="Enter your flashcard topic here..."
                                rows={4}
                            />
                            <Button
                                className="bg-orange-500 w-full font-bold"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {flashcards.length > 0 && (
                    <div className="max-w-xl w-full">
                        <h3 className="text-2xl font-bold block mb-2 text-center">Flashcards Preview</h3>
                        <hr className="w-1/4 mx-auto border-2 border-orange-500 mt-2 mb-4" />
                        <div className="flex flex-col items-center">
                            <div
                                className="relative w-full h-72"
                                // style={{
                                //     perspective: '1000px',
                                // }}
                                onClick={handleCardClick}
                            >
                                <div
                                    className="absolute inset-0 rounded-full"
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
                            <div className="flex space-x-4 mt-4">
                                <Button variant="default" size="icon" className="" onClick={handlePrevCard}>
                                    <FaRegArrowAltCircleLeft className="w-6 h-6" />
                                </Button>
                                <Button variant="default" size="icon" onClick={handleNextCard}>
                                    <FaRegArrowAltCircleRight className="w-6 h-6" />
                                </Button>
                            </div>
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
        </div >
    );
}