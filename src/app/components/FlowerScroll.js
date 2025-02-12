// components/FlowerScroll.jsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";

const FlowerScroll = () => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div className="relative w-full h-64 overflow-hidden">
      <motion.img
        src="/images/rose-long.jpg" // Replace with your rose image
        alt="Floating Rose"
        className="w-16 h-16 absolute"
        style={{ x, y }}
      />
      <motion.img
        src="/images/rose-wide.jpg" // Replace with your rose image
        alt="Floating Rose"
        className="w-16 h-16 absolute"
        style={{ x: useTransform(scrollYProgress, [0, 1], [100, -100]), y }}
      />
    </div>
  );
};

export default FlowerScroll;