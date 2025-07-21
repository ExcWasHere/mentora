import { useEffect, useState, useCallback } from "react";

interface SlideContent {
  id: number;
  image: string;
}

const heroContent: SlideContent[] = [
  {
    id: 1,
    image: "MQ1.jpg",
  },
  {
    id: 2,
    image: "MQ2.jpg",
  },
  {
    id: 3,
    image: "MQ3.jpg",
  },
];

interface IndicatorProps {
  isActive: boolean;
  onClick(): void;
}

const Indicator = ({ isActive, onClick }: IndicatorProps) => (
  <button
    className={`w-3 h-3 rounded-full mx-1.5 transition-all duration-300 hover:scale-110 ${
      isActive 
        ? "bg-blue-500 scale-125 shadow-lg" 
        : "bg-blue-200 hover:bg-blue-300"
    }`}
    onClick={onClick}
    aria-label={`Go to slide ${isActive ? 'current' : 'next'}`}
  />
);

export default function IndexHero() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPostIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
      setIsAnimating(false);
    }, 500);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleIndicatorClick = (index: number) => {
    if (index === currentPostIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPostIndex(index);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* padding-top */}
      <div 
        className="relative w-full overflow-hidden pt-32 pb-16"
        style={{ 
          minHeight: '90vh'
        }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-white" />
        </div>

        {/* Main Content Container */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
            
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-black">Hai Kenalin!</span>
                  <br />
                  <span className="text-black">Aku</span>
                  <span className="text-sky-500 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    MenTora
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-lg text-justify">
                Mau tau kondisi emosional diri sendiri? Badmood tapi gaada yang ngertiin? atau anxiety dateng tiba-tiba? Cobain MenTora aja, MenTora cocok buat kamu!.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-white font-semibold rounded-full shadow-lg hover:from-sky-500 hover:to-sky-600 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  Kepoin Yuk!
                </button>
              </div>
            </div>
            {/* Right Column - Image Content */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-lg w-full">
                {/* Main Image with animation only on image */}
                <div 
                  className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ${
                    isAnimating 
                      ? "opacity-0 transform translate-x-8" 
                      : "opacity-100 transform translate-x-0"
                  }`}
                >
                  <img
                    src={heroContent[currentPostIndex].image}
                    alt={heroContent[currentPostIndex].title}
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>

                {/* Indicators positioned below the image */}
                <div className="flex justify-center items-center gap-2 pt-6">
                  {heroContent.map((_, index) => (
                    <Indicator
                      key={`image-${index}`}
                      isActive={index === currentPostIndex}
                      onClick={() => handleIndicatorClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}