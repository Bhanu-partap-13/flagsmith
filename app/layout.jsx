import Navbar from "@/app/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { FlagsmithProvider } from "./components/flagsmithcontext";



export const metadata = {
  title: "Weebopedia",
  description: "Community for the weebs!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className="bg-black text-white">

      <FlagsmithProvider>

        <Navbar/>
        
          {children}
          </FlagsmithProvider>
      </body>
    </html>
  );
}
