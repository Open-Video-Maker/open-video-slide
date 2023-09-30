"use client";
import { useRef } from "react";
import { Button, Header, Slide } from "ui";
import type { SlideImageProps, SlideRef } from "ui";

const TEXT = `健康饮食指南:吃什么可以让你更健康?
亲爱的朋友们,您是否也想通过饮食来改善健康呢?其实,通过选择一些营养丰富的食物,我们可以很容易地让身体更健康。
1. 水果和蔬菜
水果和蔬菜富含维生素、矿物质和膳食纤维,对身体大有裨益。例如苹果、梨、西蓝花和菠菜都含有丰富的抗氧化成分,可以帮助预防疾病。
2. 全谷物和豆类
全谷物面包和米饭以及各种豆类如黑豆和绿豆,都富含复杂碳水化合物和蛋白质,有助于长期饱腹和健康。
3. 鱼类和蛋
鱼类如三文鱼和鲑鱼富含omega-3脂肪酸,有益心脏健康。而蛋白质丰富的鸡蛋也是健康的选择。
4. 坚果和种子
坚果如核桃和瓜子,以及亚麻籽和芥花籽都富含营养,可以作为零食选择。
5. 保持水分充足
每天喝足够的水,可以帮助身体各系统正常运行。清水和绿茶都是很好的选择。`;
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

  const startAutoplay = async () => {
    const source = await getAudioSource(TEXT);
    console.log(source.buffer?.duration);
    source.start();
    // Call the startAutoplay function on the Slide component
    slideRef.current?.startAutoplay();
  };

  const getAudioSource = async (text: string) => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const buffer = await res.arrayBuffer();

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    return source;
  };

  return (
    <>
      <Header text="Web" />
      <Button />
      <button onClick={startAutoplay}>Start Autoplay</button>
      <Slide effect="fade" images={images} ref={slideRef} size={[360, 640]} />
    </>
  );
}
