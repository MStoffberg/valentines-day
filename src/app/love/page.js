"use client";
import Link from "next/link";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FlowerScroll from "../components/FlowerScroll";

export default function LovePage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  useEffect(() => {
    const audio = new Audio("/sounds/invisible string.mp3"); // Replace with your music file
    audio.loop = true;
    audio.play();

    return () => audio.pause();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 text-center p-6">
      <motion.h1
        className="text-5xl font-bold text-pink-600 mb-4"
        style={{ scale, rotate }}
      >
        💖 You’re My Valentine! 💖
      </motion.h1>
      <motion.p
        className="text-lg text-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        No matter what, you are now my Valentine forever! 💜
      </motion.p>

      {/* Flower Scroll Component */}
      {/* <FlowerScroll /> */}

      {/* Animated Roses */}
      <motion.img
        src="/images/rose.webp" // Replace with your rose image
        alt="Rose"
        // className="w-24 h-24 mt-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      />

      {/* Hello Kitty Image */}
      <motion.img
        src="/images/Hello Kitty.webp"
        alt="Hello Kitty Love"
        className="w-40 h-40 mt-6"
        whileHover={{ scale: 1.1 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      />

      {/* Back to Menu Button */}
      <Link href="/">
        <motion.button
          className="mt-8 px-6 py-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Back to Menu
        </motion.button>
      </Link>
    </div>
  );
}