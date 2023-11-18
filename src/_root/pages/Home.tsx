import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import Slider from "@/components/shared/Slider";

const Home = () => {
  // const { toast } = useToast();
  const { t } = useUserContext();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">{t("Something bad happened")}</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">{t("Something bad happened")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
  
          <div className="flex gap-2 w-full max-w-5xl">
            <img
              src="/assets/icons/home.svg"
              width={36}
              height={36}
              alt="edit"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">{t("Home Feed")}</h2>

          </div>

          <div className=" gap-2 w-full">
            <Slider />
          </div>


          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">{t("Top Creators")}</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
