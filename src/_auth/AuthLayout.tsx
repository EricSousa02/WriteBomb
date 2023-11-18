import { Outlet, Navigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <video
              src="/assets/images/neon.mp4"
              autoPlay
              muted
              loop
              preload="auto"
              className="absolute h-full w-full object-cover bg-no-repeat z-0"
            />

            <Outlet />
          </section>


        </>
      )}
    </>
  );
}
