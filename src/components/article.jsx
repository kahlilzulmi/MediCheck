import React, { useState } from "react";

const Article = () => {
  const articles = [
    {
      id: 1,
      title: "Kesehatan Mental dan Kesehatan Fisik",
      image: "https://loremflickr.com/360/200/sketch",
      excerpt: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: 2,
      title: "Pencegahan Penyakit Jantung",
      image: "https://loremflickr.com/360/201/sketch",
      excerpt: "Recusandae, animi? Nihil, suscipit?",
    },
    {
      id: 3,
      title: "Pentingnya Olahraga Rutin",
      image: "https://loremflickr.com/360/202/sketch",
      excerpt: "Ullam, repellat. Dolorum fuga ratione sit.",
    },
    {
      id: 4,
      title: "Nutrisi Seimbang untuk Kesehatan Optimal",
      image: "https://loremflickr.com/360/203/sketch",
      excerpt: "Praesentium, fugiat temporibus! Illum, laborum.",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleArticles = articles.slice(startIndex, startIndex + 3);

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + 3 < articles.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <section id="article" className="pt-36 pb-32 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark mb-2">Artikel Kesehatan Terbaru</h2>
          <p className="text-secondary">Temukan Opini dan Fakta Menarik Seputar Kesehatan</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            disabled={startIndex === 0}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            disabled={startIndex + 3 >= articles.length}
          >
            →
          </button>
        </div>

        <div className="flex flex-wrap -mx-4">
          {visibleArticles.map((article) => (
            <div
              key={article.id}
              className="w-full px-4 md:w-1/2 xl:w-1/3"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-10">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full"
                />
                <div className="py-8 px-6">
                  <h3>
                    <a
                      href="#"
                      className="block mb-3 font-semibold text-xl text-dark hover:text-primary truncate"
                    >
                      {article.title}
                    </a>
                  </h3>
                  <p className="font-medium text-secondary text-base mb-6">
                    {article.excerpt}
                  </p>
                  <a
                    href="#"
                    className="font-medium text-sm bg-primary text-white px-4 py-2 rounded-lg hover:opacity-80"
                  >
                    Baca Selengkapnya
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Article;
