import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function LoveScrollPage() {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div style={{ scale, opacity }}>
        <Image
          src="/images/spider-lily.svg"
          alt="Pink Spider Lily"
          width={200}
          height={200}
        />
      </motion.div>
      <motion.p
        className="text-center text-pink-600 text-xl mt-6"
        style={{ opacity }}
      >
            I love you more than words can say. No distance can keep my heart from yours.
            You are my light, my joy, and my forever.
        </motion.p>
    </div>
  );
}
