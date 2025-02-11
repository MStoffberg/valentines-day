"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className = "content">
      <Image
        src="/images/hellokitty-icon.png"
        alt="Hello Kitty Logo"
        className="logo"
        width={300}
        height={300}
      />
      <h1>Will you be my valentines</h1>
      <h2>💜 Kitty Love Invaders 💜</h2>
      <div className="btn-container">
        <Link href="/game">
          <button>Start Game 🎮</button>
        </Link>
        <Link href="/love">
          <button>I Love You 💖</button>
        </Link>
        <button onClick={() => alert("You can’t escape! 💕")}>Exit ❌</button>
      </div>
    </div>
  );
}
