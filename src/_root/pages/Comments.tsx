// import { useToast } from "@/components/ui/use-toast";
import {
  useAddComment,
  useDeleteComment,
  useDeletePost,
  useGetPostById,
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";

import { multiFormatDateString } from "@/lib/utils";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  Textarea,
} from "@/components/ui";
import { CommentValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { PostStats } from "@/components/shared";
import { useState, useEffect } from "react";

interface Comment {
  $id: string;
  // outras propriedades do comentário, se houver
}


const Comments = () => {
  const { t, user } = useUserContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost } = useDeletePost();
  const { mutate: addComment, isLoading: isAddingComment } = useAddComment();
  const { mutate: deleteComment, isLoading: isDeletingComment } = useDeleteComment();

  const [comments, setComments] = useState([]);
  const [comments_length, setComments_length] = useState((post?.comments || []).map((comment: { users: { $id: any; }; }) => comment.users.$id).length);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      message: post ? post?.message : "",
    },
  });


  const handleDeleteComment = (commentId: string) => {
    if (comments.some((comment: Comment) => comment.$id === commentId)) {
      const updatedComments = comments.filter((comment: { $id: string }) => comment.$id !== commentId);
      setComments(updatedComments);
      setComments_length(comments_length - 1);
      deleteComment(commentId);

    } else {
      console.error(`Comentário com ID ${commentId} não encontrado no post.`);
    }
  };
  
  


  const handleSendComment = async (value: z.infer<typeof CommentValidation>) => {
    if (post) {
      setComments_length(comments_length + 1);
      const commentData = {
        postId: post.$id,
        userId: user.id,
        message: value.message,
      };
      form.reset();
      form.setValue("message", '');
      addComment(commentData);
    }
  };
  

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  const { isError: isErrorPosts } = useGetRecentPosts();
  const { isError: isErrorCreators } = useGetUsers(10);

  useEffect(() => {
    // Atualiza os comentários quando houver mudanças
    setComments(post?.comments || []);
    setComments_length((post?.comments || []).length);
  }, [post?.comments, post]);

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
      <div className="post_details-container">
        <div className="hidden md:flex max-w-5xl w-full">
          <div className="flex gap-2 w-full max-w-5xl">
            <img
              src="/assets/icons/chat.svg"
              width={36}
              height={36}
              alt="edit"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">
              {t("Comments")}
            </h2>
          </div>

          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="shad-button_ghost">
            <img
              src={"/assets/icons/back.svg"}
              alt="back"
              width={24}
              height={24}
            />
            <p className="small-medium lg:base-medium">{t("Back")}</p>
          </Button>
        </div>

        {isLoading || !post ? (
          <Loader />
        ) : (
          <>
            <div className="post_details-card">
              <img
                src={post?.imageUrl}
                alt="creator"
                className="post_details-img"
              />

              <div className="post_details-info">
                <div className="flex-between w-full">
                  <Link
                    to={`/profile/${post?.creator.$id}`}
                    className="flex items-center gap-3">
                    <img
                      src={
                        post?.creator.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                    />
                    <div className="flex gap-1 flex-col">
                      <p className="base-medium lg:body-bold text-light-1">
                        {post?.creator.name}
                      </p>
                      <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular ">
                          {multiFormatDateString(post?.createdAt, t)}
                        </p>
                        •
                        <p className="subtle-semibold lg:small-regular truncate">
                          {post?.location}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex-center gap-4">
                    <Link
                      to={`/update-post/${post?.$id}`}
                      className={`${user.id !== post?.creator.$id && "hidden"
                        }`}>
                      <img
                        src={"/assets/icons/edit.svg"}
                        alt="edit"
                        width={24}
                        height={24}
                      />
                    </Link>

                    <Button
                      onClick={handleDeletePost}
                      variant="ghost"
                      className={`ost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"
                        }`}>
                      <img
                        src={"/assets/icons/delete.svg"}
                        alt="delete"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </div>
                </div>

                <hr className="border w-full border-dark-4/80" />

                <div className="flex flex-col flex-1 w-full overflow-auto small-medium lg:base-regular custom-scrollbar">
                  <p className="lg:max-h-[225px] lg:overflow-auto custom-scrollbar">
                    {post?.caption}
                  </p>

                  <ul className="flex gap-1 mt-2">
                    {post?.tags.map((tag: string, index: string) => (
                      <li
                        key={`${tag}${index}`}
                        className="text-light-3 small-regular">
                        #{tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full">
                  <PostStats post={post} userId={user.id} commentsLength={comments_length} />
                </div>
              </div>
            </div>
          </>
        )}

        <hr className="border w-full border-dark-4/80" />

        {isLoading || !comments ? (
          <Loader />
        ) : (
          <div className="w-full max-w-5xl">
            <div className="post_details-card ">
              <div className="post_details-info">
                {comments && comments.length > 0 ? (
                  comments.map((comment: any, index: number) => (
                    <div
                      className="flex flex-col flex-1 w-full overflow-auto small-medium lg:base-regular custom-scrollbar"
                      key={`${comment.id}-${index}`}>
                      <div
                        className={`flex flex-col ${user.id === comment?.users.$id
                            ? "bg-dark-5"
                            : "bg-dark-4"
                          } rounded-lg p-2 mb-1 lg:overflow-auto custom-scrollbar`}>
                        <div className="flex justify-between">
                          <div className="flex items-center mb-3">
                            <Link
                              to={`/profile/${comment.users.$id}`}
                              className={`cursor-pointer`}>
                              <img
                                src={comment.users.imageUrl}
                                alt={comment.users.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            </Link>

                            <span className="text-white font-bold">
                              {comment.users.name}
                            </span>
                          </div>

                          <Button
                            onClick={() => handleDeleteComment(comment.$id)}
                            variant="ghost"
                            className={`ost_details-delete_btn ${user.id !== comment?.users.$id && "hidden"
                              }`}
                            disabled={isDeletingComment}>
                            {isDeletingComment ? (
                              <Loader />
                            ) : (
                              <img
                                src={"/assets/icons/delete.svg"}
                                alt="delete"
                                width={24}
                                height={24}
                              />
                            )}
                          </Button>
                        </div>

                        <div className="mb-3">
                          <p className="text-white">{comment.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white">{t("No comments yet.")}</p>
                )}

                <hr className="border w-full border-dark-4/80" />

                <Form {...form}>
                  <form
                    className="flex flex-col gap-9 w-full max-w-5xl"
                    onSubmit={form.handleSubmit(handleSendComment)}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="shad-form_label custom-scrollbar"
                            htmlFor="message">
                            {t("Add comment")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="message"
                              className="shad-input custom-scrollbar"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="shad-form_message" />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 items-center justify-end">
                      <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isAddingComment}>
                        {isAddingComment ? t("Loading") : t("Create Comment")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
