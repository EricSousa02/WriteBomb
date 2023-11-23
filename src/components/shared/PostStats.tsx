import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";
import { Loader } from ".";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  commentsLength?: number
};

const PostStats = ({ post, userId, commentsLength }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const commentsList = post.comments.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [comments] = useState<string[]>(commentsList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isLoading: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isLoading: isDeletingPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-3">
        <img
          src={`${checkIsLiked(likes, userId)
            ? "/assets/icons/liked.svg"
            : "/assets/icons/like.svg"
            }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />

        <p className="small-medium lg:base-medium">{likes.length}</p>

        <div className="flex gap-2 ml-2">
          <Link to={`/comments/${post.$id}`}>
            <img
              src={"/assets/icons/chat.svg"}
              alt="share"
              width={20}
              height={20}
              className="cursor-pointer" />
          </Link>

          <p className="small-medium lg:base-medium">{commentsLength ? commentsLength : comments.length}</p>
        </div>

      </div>

      <div className="flex gap-7">
        {isSavingPost || isDeletingPost ? <Loader /> : <>
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)} />

        </>
        }

      </div>
    </div>
  );
};

export default PostStats;
