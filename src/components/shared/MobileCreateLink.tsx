import { useUserContext } from '@/context/AuthContext'
import { Link } from 'react-router-dom'


const MobileCreateLink = () => {

  const { t } = useUserContext()

  return (
    <Link to="/create-post">
      <div
        title={t("create")}
        className="drop-shadow-pri group fixed bottom-20 right-[1rem] z-50 cursor-pointer rounded-full bg-primary-500 p-2 md:p-1 md:hidden 
               transition-transform transform-gpu hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </div>
    </Link>
  )
}

export default MobileCreateLink

