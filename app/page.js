'use client';

import getStripe from "@/utils/getStripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import "./globals.css";
import Image from "next/image";
import { TbCardsFilled } from "react-icons/tb";
import { MdOutlineInput } from "react-icons/md";
import { IoMdGlobe } from "react-icons/io";
import { FaLightbulb } from "react-icons/fa";



export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    })

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message);
    }

  }

  return (
    <div className="w-full">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text." />
      </Head>

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

      <div className="flex flex-col justify-center items-center text-center mt-40 mb-20">
        <div className="relative">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 font-bold bg-clip-text text-transparent">Flashcard AI</h1>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 font-bold bg-clip-text text-transparent absolute top-0 opacity-90 blur">Flashcard AI</h1>
        </div>
        <div className="relative">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 font-bold bg-clip-text text-transparent">Built by students, for students.</h1>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 font-bold bg-clip-text text-transparent absolute top-0 opacity-80 blur">Built by students, for students.</h1>
        </div>
        <text className="text-2xl mt-4 mb-4">Transform your study habits with our AI-powered flashcards. <br />Unlock faster learning, better retention, and a more personalised study experience - anytime, anywhere.</text>
        <Button variant="outline" size="lg" className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300 mt-4 text-orange-500 text-md font-bold border-2 border-orange-500 rounded-full hover:shadow-sm hover:bg-orange-500 hover:text-white">Get Started</Button>
        <p className="text-lg mt-8">Feeling overwhelmed by old-fashioned study methods?</p>
        <Image src="/images/studentnew.svg" alt="student" width={1200} height={1200} quality={100} />
        <p className="text-lg">Discover a smarter, scientifically proven method to enhance your study routine with our flashcards.</p>
      </div>

      {/* Icon Blocks */}
      <div className="container py-16 lg:py-10">
        <div className="mx-auto text-center mb-10">
          <h2 className="text-4xl text-black font-bold">Features</h2>
          <hr className="mt-2 w-20 mx-auto border-2 border-orange-500" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-12">
          {/* Icon Block */}
          <div className="text-center">
            <div className="flex justify-center items-center w-12 h-12 bg-orange-500 border rounded-full mx-auto">
              <MdOutlineInput className="flex-shrink-0 w-5 h-5 text-primary-foreground" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold ">Effortless Text Input</h3>
              <p className="mt-1 text-muted-foreground">
                Just enter your text, and we'll handle the rest. Creating flashcards has never been this simple.
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          <div className="text-center">
            <div className="flex justify-center items-center w-12 h-12 bg-orange-500 border rounded-full mx-auto">
              <FaLightbulb className="flex-shrink-0 w-5 h-5 text-primary-foreground" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold ">Intelligent Flashcards</h3>
              <p className="mt-1 text-muted-foreground">
                Our AI smartly transforms your text into concise flashcards, perfect for studying.
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          <div className="text-center">
            <div className="flex justify-center items-center w-12 h-12 bg-orange-500 border rounded-full mx-auto">
              <IoMdGlobe className="flex-shrink-0 w-5 h-5 text-primary-foreground" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold ">Study Anytime, Anywhere</h3>
              <p className="mt-1 text-muted-foreground">
                Access your flashcards from any device, at any time. Studying on the go has never been easier.
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          {/* <div className="text-center">
            <div className="flex justify-center items-center w-12 h-12 bg-primary border rounded-full mx-auto">
              <MessagesSquareIcon className="flex-shrink-0 w-5 h-5 text-primary-foreground" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold ">24/7 Support</h3>
              <p className="mt-1 text-muted-foreground">
                Contact us 24 hours a day, 7 days a week
              </p>
            </div>
          </div> */}
          {/* End Icon Block */}
        </div>
      </div>
      {/* End Icon Blocks */}

      {/* Pricing */}
      <div className="container py-10 lg:py-20">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 text-4xl font-bold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <hr className="mt-2 w-20 mx-auto border-2 border-orange-500" />
          <p className="mt-1 text-muted-foreground">
            Our offers evolve according to your needs.
          </p>
        </div>
        {/* End Title */}
        {/* Switch */}
        <div className="flex justify-center items-center">
          <Label htmlFor="payment-schedule" className="me-3">
            Monthly
          </Label>
          <Switch id="payment-schedule" />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-black"
                  />
                </svg>
                <Badge className="mt-3 uppercase bg-orange-500 hover:bg-orange-400">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        {/* End Switch */}
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          {/* Card */}
          <Card className="transition ease-in-out delay-50 hover:scale-105 duration-300 shadow-md hover:shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Free</CardTitle>
              <span className="font-bold text-5xl">€0</span>
            </CardHeader>
            <CardDescription className="text-center">
              Limited access to flashcard features
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">50 Flashcards</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Limited Storage</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"outline"}>
                Choose Free
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="transition ease-in-out delay-50 hover:scale-105 duration-300 shadow-md hover:shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="!mb-7">Basic</CardTitle>
              <span className="font-bold text-5xl">€5</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              Access to basic flashcard features
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Unlimited Flashcards</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Basic Features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Choose Basic</Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="transition ease-in-out delay-50 hover:scale-105 duration-300 shadow-md hover:shadow-sm">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3 bg-orange-500">
                Most popular
              </Badge>
              <CardTitle className="mb-7">Pro</CardTitle>
              <span className="font-bold text-5xl">€10</span>
            </CardHeader>
            <CardDescription className="text-center  w-11/12 mx-auto">
              Unlimited flashcards and storage, with priority support
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Unlimited Flashcards</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Pro Features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Priority Product Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full font-bold">
                Choose Pro
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          {/* End Card */}
        </div>
        {/* End Grid */}
      </div>

      {/* Footer */}
      <footer>
        <div className="container py-10">
          <div className="flex justify-center items-center">
            <p className="text-muted-foreground">
              &copy; 2024 Sebastian Bury -- All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}