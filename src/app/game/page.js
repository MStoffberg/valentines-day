"use client"; 


import dynamic from 'next/dynamic';

// Dynamically import the SpaceInvaders component and disable SSR (server-side rendering)
const SpaceInvaders = dynamic(() => import('../components/gameLogic'), {
  ssr: false, // Disable server-side rendering
});

export default function Home() {
  return (
    <div className="content">
      <SpaceInvaders />
    </div>
  );
}