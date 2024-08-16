'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/getStripe";
import { useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";


export default function ResultPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!sessionId) return;

            try {
                const response = await fetch(`/api/checkout_sessions?session_id=${sessionId}`);
                const sessionData = await response.json();

                if (response.ok) {
                    setSession(sessionData);
                }
                else {
                    setError(sessionData.error);
                }

            } catch (error) {
                setError("An error occurred:", error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCheckoutSession();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="w-full text-center mt-4 justify-center items-center">
                <Progress value={100} />
                <h6>Loading...</h6>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full text-center mt-4 justify-center items-center">
                <h6>{error}</h6>
            </div>
        )
    }

    return (
        <div className="w-full text-center mt-4 justify-center items-center">
            {session.payment_status === "paid" ? (
                <>
                    <div className="mt-4 flex flex-col justify-center items-center text-center">
                        <h4>Thank you for purchasing!</h4>
                        <h6>Session ID: {sessionId}</h6>
                        <p>We have received your payment. You will receive an email with the order details.</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="mt-4 flex flex-col justify-center items-center text-center">
                        <h4>Payment Failed</h4>
                        <p>Your payment was unsuccessful. Please try again.</p>
                    </div>
                </>
            )}
        </div>
    )
}