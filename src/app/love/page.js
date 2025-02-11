"use client";
import Link from "next/link";
import FlowerScroll from "../components/FlowerScroll"; 

export default function LovePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 text-center p-6">
      <h1 className="text-5xl font-bold text-pink-500 mb-4">💖 You’re My Valentine! 💖</h1>
      <p className="text-lg text-gray-700">No matter what, you are now my Valentine forever! 💜</p>
      {/* <FlowerScroll /> */}
      <img src="images/Hello Kitty.webp" alt="Hello Kitty Love" className="w-40 h-40 mt-6" />
      <Link href="/">
        <button className="button">Back to Menu</button>
      </Link>
    </div>
  );
}
