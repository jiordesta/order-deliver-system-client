import React from "react";

export default function Hero() {
  return (
    <div className="w-full flex justify-center items-center px-8">
      <div className="w-full lg:w-3/4 text-color1 font-semibold">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl">
          ByteBite: Seamless Ordering Experience
        </h1>
        <p className="hidden md:block">
          "Indulge in the ultimate convenience with ByteBite, where ordering
          your favorite meals is as simple as a click. Our platform offers a
          seamless and user-friendly experience, ensuring that your cravings are
          satisfied with just a few taps on your device. Explore a diverse menu,
          enjoy swift delivery, and elevate your dining experience with ByteBite
          – where ease meets exceptional taste. Your satisfaction is our
          priority, making every order a delightful journey in the world of
          culinary convenience. Welcome to ByteBite, where ordering is not just
          a task but a pleasurable experience."
        </p>
      </div>
    </div>
  );
}
