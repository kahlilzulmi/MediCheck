import React, { useState } from "react";

const articles = [
  {
    title: "Tips Menjaga Imun Tubuh",
    desc: "Beberapa cara agar tetap sehat dan terhindar dari penyakit.",
    img: "https://loremflickr.com/360/200/health",
  },
  {
    title: "Makanan Sehat untuk Jantung",
    desc: "Rekomendasi makanan yang baik untuk kesehatan jantung.",
    img: "https://loremflickr.com/340/200/healthy_food",
  },
  {
    title: "Manfaat Olahraga Rutin",
    desc: "Pentingnya menjaga kebugaran dengan olahraga.",
    img: "https://loremflickr.com/360/201/fitness",
  },
];

function Article() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="article" className="pt-36 pb-32 bg-red-50">
      <div className="container mx-auto">
        <div className="w-full px-4 text-center mb-16">
          <h4 className="font-semibold text-lg text-red-500 mb-2">Artikel</h4>
          <h2 className="font-bold text-gray-800 text-3xl mb-4">
            Kesehatan & Gaya Hidup
          </h2>
          <p className="font-medium text-gray-600">
            Temukan berbagai informasi seputar kesehatan untuk menjaga tubuh
            tetap bugar dan bebas dari penyakit.
          </p>
        </div>

        <div className="relative w-full max-w-3xl mx-auto">
          <img
            src={articles[activeIndex].img}
            alt={articles[activeIndex].title}
            className="rounded-lg shadow-lg w-full object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black/50 p-4 rounded-lg">
            <h5 className="text-xl font-bold">{articles[activeIndex].title}</h5>
            <p className="text-sm">{articles[activeIndex].desc}</p>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded-full shadow hover:bg-gray-100"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded-full shadow hover:bg-gray-100"
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
}

export default Article;
