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
  
    // useEffect para resetar o useRef quando a página for carregada novamente
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
          className="flex p-2 gap-4 sm:gap-2"
        >
          {creators?.documents.slice(0, 10).map((creator) => (
            <motion.div
              className="p-2 flex-shrink-0 text-center"
              key={creator.$id}
            >
              <div className="rounded-full overflow-hidden">
                <Link to={`/profile/${creator.$id}`}>
                  <img
                    src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="teste"
                    className="w-12 h-12 sm:w-16 sm:h-16 pointer-events-none mx-auto"
                  />
                </Link>
              </div>
              {/* <p className="text-xs mt-1 truncate">
                {creator.name.split(" ")[0]}
              </p> */}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  };
  
  export default Slider;
  
