import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Play, Info, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});


// Mock data for movies/shows
const featuredContent = {
  title: "The Last Kingdom",
  description: "A story of redemption, vengeance, and self-discovery set against the birth of England.",
  image: "/images/featuredmovie.jpeg",
  genre: "Historical Drama"
};

const contentRows = [
  {
    title: "Trending Now",
    items: [
      { title: "Stranger Things", image: "/images/movie1.jpeg", genre: "Sci-Fi" },
      { title: "The Crown", image: "/images/movie2.jpeg", genre: "Drama" },
      { title: "Ozark", image: "/images/movie3.jpeg", genre: "Crime" },
      { title: "Bridgerton", image: "/images/movie1.jpeg", genre: "Romance" },
      { title: "The Witcher", image: "/images/movie2.jpeg", genre: "Fantasy" },
      { title: "Money Heist", image: "/images/movie3.jpeg", genre: "Thriller" },
    ]
  },
  {
    title: "Popular on LOAR",
    items: [
      { title: "House of Cards", image: "/images/movie1.jpeg", genre: "Political" },
      { title: "Narcos", image: "/images/movie2.jpeg", genre: "Crime" },
      { title: "Dark", image: "/images/movie3.jpeg", genre: "Sci-Fi" },
      { title: "The Queen's Gambit", image: "/images/movie1.jpeg", genre: "Drama" },
      { title: "Lupin", image: "/images/movie2.jpeg", genre: "Crime" },
      { title: "Squid Game", image: "/images/movie3.jpeg", genre: "Thriller" },
    ]
  },
  {
    title: "New Releases",
    items: [
      { title: "Wednesday", image: "/images/movie1.jpeg", genre: "Comedy" },
      { title: "1899", image: "/images/movie2.jpeg", genre: "Mystery" },
      { title: "The Sandman", image: "/images/movie3.jpeg", genre: "Fantasy" },
      { title: "Dahmer", image: "/images/movie1.jpeg", genre: "Crime" },
      { title: "Heartstopper", image: "/images/movie2.jpeg", genre: "Romance" },
      { title: "The Bear", image: "/images/movie3.jpeg", genre: "Comedy" },
    ]
  }
];

function ContentRow({ title, items, isFirst = false }: { title: string; items: any[]; isFirst?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="mb-6">
      <h2 className={`text-lg font-semibold mb-3 px-4 ${isFirst ? 'mt-8' : ''}`}>{title}</h2>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center hover:from-black/90 transition-all"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center hover:from-black/90 transition-all"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-40 group cursor-pointer"
                        >
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 object-cover rounded-md transition-transform group-hover:scale-105"
                            />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-md" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <p className="text-gray-300 text-xs">{item.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${featuredContent.image})`,
            filter: 'brightness(0.6)'
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-2xl px-8">
            <h1 className="text-6xl font-bold mb-4 leading-tight">
              {featuredContent.title}
            </h1>
            <p className="text-xl mb-6 text-gray-200 max-w-lg">
              {featuredContent.description}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                <Play className="mr-2 h-5 w-5" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="border-gray-400 text-white hover:bg-white/10">
                <Info className="mr-2 h-5 w-5" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-20 -mt-8 pb-8">
        {contentRows.map((row, index) => (
          <ContentRow key={index} title={row.title} items={row.items} isFirst={index === 0} />
        ))}
      </div>


      {/* API Status Indicator */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded-lg">
          <div
            className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-xs text-gray-300">
            {healthCheck.isLoading
              ? "Connecting..."
              : healthCheck.data
                ? "Online"
                : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}
