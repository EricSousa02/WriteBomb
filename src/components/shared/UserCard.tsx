import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queries";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: actualUser, t } = useUserContext();

  const { data: currentUser } = useGetUserById(user.$id || "");

  // Verificar se currentUser é definido antes de acessar suas propriedades
  const isFollowing = currentUser?.followers?.includes(actualUser.id);

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1 truncate w-[160px]">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1 truncate w-[150px]">
          @{user.username}
        </p>
      </div>

      {user.$id === actualUser.id ?
      <Button type="button" size="sm" className="shad-button_primary px-5">
        {t("Your profile")}
      </Button>
        :
      <Button type="button" size="sm" className="shad-button_primary px-5">
        {isFollowing ? t("Following") : t("Follow")}
      </Button>}
    </Link>
  );
};

export default UserCard;
