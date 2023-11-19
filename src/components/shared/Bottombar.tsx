import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { bottombarLinks, bottombarLinksPt } from "@/constants";
import { useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import MobileCreateLink from "./MobileCreateLink";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { currentLanguage } = useUserContext();

  const buttonVariants = {
    initial: { scale: 1 },
    active: { scale: 1.2 },
  };

  return (
    <>
      <section className="bottom-bar">
        {currentLanguage === "en"
          ? bottombarLinks.map((link) => {
              const isActive = pathname === link.route;
              return (
                <motion.div
                  key={`bottombar-${link.label}`}
                  initial="initial"
                  animate={isActive ? "active" : "initial"}
                  variants={buttonVariants}
                  transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.5 }}
                  className={`${
                    isActive && "rounded-[10px] bg-primary-500 "
                  } flex-center flex-col gap-1 p-2 transition`}>
                  <Link to={link.route}>
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      width={16}
                      height={16}
                      className={`${isActive && "invert-white"}`}
                    />
                  </Link>
                </motion.div>
              );
            })
          : bottombarLinksPt.map((link) => {
              const isActive = pathname === link.route;
              return (
                <motion.div
                  key={`bottombar-${link.label}`}
                  initial="initial"
                  animate={isActive ? "active" : "initial"}
                  variants={buttonVariants}
                  transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.5 }}
                  className={`${
                    isActive && "rounded-[10px] bg-primary-500 "
                  } flex-center flex-col gap-1 p-2 transition`}>
                  <Link to={link.route}>
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      width={16}
                      height={16}
                      className={`${isActive && "invert-white"}`}
                    />
                  </Link>
                </motion.div>
              );
            })}
      </section>
      <MobileCreateLink />
    </>
  );
};

export default Bottombar;
