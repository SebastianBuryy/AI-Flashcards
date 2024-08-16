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
          <div className="">
            <h2 className="text-xl bg-gradient-to-r from-amber-500 to-pink-500 font-bold bg-clip-text text-transparent">Flashcard SaaS</h2>
          </div>
          <div className="space-x-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button asChild variant="outline" className="text-md border-black border-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild variant="outline" className="text-md border-2 rounded-full bg-white">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center text-center mt-40">
        <text className="text-4xl font-bold">Welcome to Flashcard SaaS!</text>
        <text className="text-xl mt-2">The easiest way to make flashcards from your text.</text>
        <Button className="mt-4 bg-red-500 text-white">Get Started</Button>
      </div>

      {/* Features */}
      <div className="mt-6 flex flex-col justify-center items-center text-center">
        <text className="text-4xl font-bold">Features</text>
        <div className="flex mt-4 grid grid-cols-3 gap-4">
          <div className="flex flex-col justify-center items-center text-center max-w-sm">
            <text className="text-xl font-bold">Easy Text Input</text>
            <text className="text-md">Simply input your text and let us do the rest.<br />Creating flashcards has never been easier.</text>
          </div>
          <div className="flex flex-col justify-center items-center text-center max-w-sm">
            <text className="text-xl font-bold">Smart Flashcards</text>
            <text className="text-md">Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</text>
          </div>
          <div className="flex flex-col justify-center items-center text-center max-w-sm">
            <text className="text-xl font-bold">Accessible Anywhere</text>
            <text className="text-md">Access your flashcards on any device, at any time. Study on the go with ease.</text>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="container py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-muted-foreground">
            Whatever your status, our offers evolve according to your needs.
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
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        {/* End Switch */}
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          {/* Card */}
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Free</CardTitle>
              <span className="font-bold text-5xl">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Forever free
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">1 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Limited flashcards</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
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
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="!mb-7">Basic</CardTitle>
              <span className="font-bold text-5xl">$5 / month</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              Access to basic flashcard features and limited storage.
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">2 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Plan features</span>
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
          <Card className="border-primary">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3">
                Most popular
              </Badge>
              <CardTitle className="mb-7">Pro</CardTitle>
              <span className="font-bold text-5xl">$10 / month</span>
            </CardHeader>
            <CardDescription className="text-center  w-11/12 mx-auto">
              Unlimited flashcards and storage, with priority support.
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">5 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Plan features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full">
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
    </div>
  );
}