import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { useUserContext } from "@/context/AuthContext";

const RootLayout = () => {
  const { isAuthenticated, checkAuthUser } = useUserContext();

  useEffect(() => {
    // Chamada para verificar a autenticação do usuário ao montar o componente
    checkAuthUser();
  }, []); // Agora, a chamada ocorrerá apenas quando checkAuthUser mudar

  return (
    <>
      {!isAuthenticated ? (
        <Navigate to="/sign-in" />
      ) : (
        <div className="w-full md:flex">
          <Topbar />
          <LeftSidebar />

          <section className="flex flex-1 h-full">
            <Outlet />
          </section>

          <Bottombar />
        </div>
      )}
    </>
  );
};

export default RootLayout;
