import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Adicionado o import do Framer Motion
import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user, t } = useUserContext();

  if (!post.creator) return null; // Retorne null se o criador não estiver presente

  return (
    <motion.div
      className="post-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <motion.img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            />
          </Link>

          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className=" flex items-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt, t)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </motion.div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <motion.img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <motion.div
          className="small-medium lg:base-medium py-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li
                key={`${tag}${index}`}
                className="text-light-3 small-regular"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="max-w-full max-h-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img"
          />
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PostStats post={post} userId={user.id} />
      </motion.div>
    </motion.div>
  );
};

export default PostCard;
