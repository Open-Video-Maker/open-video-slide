"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCoverflow,
  EffectCube,
  EffectFade,
  EffectFlip,
} from "swiper/modules";
import type { Ref } from "react";
import type { SwiperRef } from "swiper/react";
import type {
  CoverflowEffectOptions,
  CubeEffectOptions,
  FadeEffectOptions,
  FlipEffectOptions,
} from "swiper/types";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cube";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";

export interface SlideImageProps {
  src: string;
  duration: number;
}

export interface SlideProps {
  images: SlideImageProps[];
  /** default value: "fade" */
  effect?: "fade" | "cube" | "flip" | "coverflow";
  /** default value([width, height]): [1080, 1920] */
  size?: [number, number];
}

export interface SlideRef {
  startAutoplay: () => void;
}

const EffectOptions: {
  fade: { fadeEffect: FadeEffectOptions };
  cube: { cubeEffect: CubeEffectOptions };
  flip: { flipEffect: FlipEffectOptions };
  coverflow: { coverflowEffect: CoverflowEffectOptions };
} = {
  fade: {
    fadeEffect: {},
  },
  cube: {
    cubeEffect: {
      shadow: false,
    },
  },
  flip: {
    flipEffect: {},
  },
  coverflow: {
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  },
};

const Wrapper = styled.div<{ width: number; height: number }>`
  .swiper {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    margin: 0;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
  }

  .swiper-slide img {
    display: block;
    height: 100%;
  }
`;

function Slide_(
  { images, effect, size }: SlideProps,
  ref: Ref<SlideRef>
): JSX.Element {
  const _ref = useRef<SwiperRef>(null);
  const _effect = effect || "fade";
  const [width = 1080, height = 1920] = size || [];

  useImperativeHandle(ref, () => ({
    startAutoplay() {
      _ref.current?.swiper?.autoplay?.start();
    },
  }));

  const onReachEndHandler = (): void => {
    _ref.current?.swiper?.autoplay?.stop();
  };

  return (
    <Wrapper width={width} height={height}>
      <Swiper
        ref={_ref}
        effect={_effect}
        onReachEnd={onReachEndHandler}
        modules={[
          EffectFade,
          EffectCube,
          EffectFlip,
          EffectCoverflow,
          Autoplay,
        ]}
        {...EffectOptions[_effect]}
      >
        {images.map((item) => (
          <SwiperSlide key={item.src} data-swiper-autoplay={item.duration}>
            <img src={item.src} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  );
}

export const Slide = forwardRef<SlideRef, SlideProps>(Slide_);
