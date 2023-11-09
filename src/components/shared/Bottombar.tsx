import { Link, useLocation } from "react-router-dom";

import { bottombarLinks, bottombarLinksPt } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import MobileCreateLink from "./MobileCreateLink";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { currentLanguage } = useUserContext();

  return (
    <><section className="bottom-bar">
      {currentLanguage === "en" ?
        (bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <Link
              key={`bottombar-${link.label}`}
              to={link.route}
              className={`${isActive && "rounded-[10px] bg-primary-500 "} flex-center flex-col gap-1 p-2 transition`}>
              <img
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className={`${isActive && "invert-white"}`} />
            </Link>
          );
        }))
        :
        (bottombarLinksPt.map((link) => {
          const isActive = pathname === link.route;
          return (
            <Link
              key={`bottombar-${link.label}`}
              to={link.route}
              className={`${isActive && "rounded-[10px] bg-primary-500 "} flex-center flex-col gap-1 p-2 transition`}>
              <img
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className={`${isActive && "invert-white"}`} />
            </Link>
          );
        }))}

    </section><MobileCreateLink /></>
  );
};

export default Bottombar;
