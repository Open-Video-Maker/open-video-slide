"use client";
import { useRef } from "react";
import { Button, Header, Slide } from "ui";
import type { SlideImageProps, SlideRef } from "ui";

const images: SlideImageProps[] = [
  { src: "https://swiperjs.com/demos/images/nature-1.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-2.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-3.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-4.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-5.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-6.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-7.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-8.jpg", duration: 3000 },
];

export default function Page(): JSX.Element {
  const slideRef = useRef<SlideRef>(null);

  const startAutoplay = (): void => {
    // Call the startAutoplay function on the Slide component
    slideRef.current?.startAutoplay();
  };

  return (
    <>
      <Header text="Web" />
      <Button />
      <button onClick={startAutoplay}>Start Autoplay</button>
      <Slide effect="fade" images={images} ref={slideRef} />
    </>
  );
}
