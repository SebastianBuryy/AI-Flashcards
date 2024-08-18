import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const manrope = Manrope({ subsets: ['latin'] })

export const metadata = {
  title: "Flashcard AI",
  description: "Built by students, for students.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={manrope.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
