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
          <section className="relative flex flex-1 justify-center items-center flex-col py-10 overflow-hidden">
            <div className="lg:hidden absolute inset-0 bg-dark-1 z-10 h-full mx-auto my-auto w-full">
            <video
              src="/assets/images/neon.mp4"
              autoPlay
              muted
              loop
              preload="auto"
              className="absolute h-full w-full object-cover z-0"
            />
            </div>

            <video
              src="/assets/images/neon.mp4"
              autoPlay
              muted
              loop
              preload="auto"
              className="hidden lg:block absolute h-full w-full object-cover z-0"
            />

            <Outlet />
          </section>
        </>
      )}
    </>
  );
}
