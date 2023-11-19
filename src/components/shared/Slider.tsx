import { motion } from "framer-motion";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { useGetUsers } from "@/lib/react-query/queries";
import { Link } from "react-router-dom";

const Slider = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);


  useLayoutEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    carousel.current = null;
  }, []);

  const { data: creators } = useGetUsers(10);

  return (
    <motion.div
      ref={carousel}
      className="cursor-grab w-full overflow-hidden md:hidden"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      layout
    >
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className={`flex py-5 ${window.innerWidth <= 300 ? 'gap-6' : 'gap-8'} sm:gap-2`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {creators?.documents.slice(0, 10).map((creator, index) => (
          <motion.div
            className={`p-0 flex-shrink-0 text-center ${index === 0 ? 'ml-0 ' : ''} ${index === 9 ? 'mr-0' : ''}`}
            key={creator.$id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className="rounded-full overflow-hidden" title={creator.name}>
              <Link to={`/profile/${creator.$id}`}>
                <motion.img
                  src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt={creator.name}
                  className="w-[12vw] h-[12vw] sm:w-16 sm:h-16 pointer-events-none mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Slider;
