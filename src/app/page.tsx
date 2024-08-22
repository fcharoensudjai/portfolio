import React from "react";
import { Title } from "@/components/title";

export default function Home() {
  return (
    <div>
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex items-center justify-center">
                <Title />
            </div>
        </div>
        <footer> footer yayay </footer>
    </div>
  );
}
