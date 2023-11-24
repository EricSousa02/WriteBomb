import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { INavLink } from "@/types";
import { sidebarLinks, sidebarLinksPt } from "@/constants";
import { Loader } from "@/components/shared";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    user,
    setUser,
    setIsAuthenticated,
    isLoading,
    currentLanguage,
    t,
    handleChangeLanguage,
  } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const MotionLink = motion(Link);

  const handleSignOut = async (
    e: React.MouseEvent<any, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <motion.nav
      className="leftsidebar"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-10">
        <Link to="/" className="flex gap-1 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={60}
            height={60}
            className=""
          />
          <h1 className="font-bold tracking-wider text-xl">
            Write<span className="text-primary-500">Bomb</span>
          </h1>
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold truncate w-[150px]">{user.name}</p>
              <p className="small-regular text-light-3 truncate">
                @{user.username}
              </p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {currentLanguage === "en"
            ? sidebarLinks.map((link: INavLink, index: number) => (
                <motion.li
                  key={link.label}
                  className={`leftsidebar-link group ${pathname === link.route &&
                    "bg-primary-500"
                  }`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <MotionLink
                    to={link.route}
                    className="flex gap-4 items-center p-4"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`group-hover:invert-white ${
                        pathname === link.route && "invert-white"
                      }`}
                    />
                    {link.label}
                  </MotionLink>
                </motion.li>
              ))
            : sidebarLinksPt.map((link: INavLink, index: number) => (
                <motion.li
                  key={link.label}
                  className={`leftsidebar-link group ${pathname === link.route &&
                    "bg-primary-500"
                  }`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <MotionLink
                    to={link.route}
                    className="flex gap-4 items-center p-4"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`group-hover:invert-white ${
                        pathname === link.route && "invert-white"
                      }`}
                    />
                    {link.label}
                  </MotionLink>
                </motion.li>
              ))}

          <motion.li
            className={`leftsidebar-link group`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * sidebarLinks.length, duration: 0.5 }}
          >
            <MotionLink
              to="#"
              className="flex gap-4 items-center p-4"
              onClick={handleChangeLanguage}
            >
              <img
                src="../../../assets/icons/language.svg"
                alt={t("Change language")}
                className={`group-hover:invert-white `}
              />
              {t("Change language")}
            </MotionLink>
          </motion.li>
        </ul>
      </div>

      <div
        className="mt-12 flex flex-col gap-6 leftsidebar-link group p-4 hover:cursor-pointer"
        onClick={(e) => handleSignOut(e)}
      >
        <MotionLink
          to="#"
          className="flex gap-4 items-center group-hover:invert-white "
          onClick={(e) => handleSignOut(e)}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">{t("Logout")}</p>
        </MotionLink>
      </div>
    </motion.nav>
  );
};

export default LeftSidebar;
