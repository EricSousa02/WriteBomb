import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation, UpdatePostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, t } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(action === "Update" ? UpdatePostValidation : PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {


    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${t("post failed. Please try again.")}`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${t("post failed. Please try again.")}`,
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label lg:text-base text-xs" htmlFor={"Textarea"}>{t("Caption")}</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar lg:text-base text-xs"
                  id={"Textarea"}
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message lg:text-base text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label lg:text-base text-xs" htmlFor={"file"}>{t("Add Photos")}</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                  id="file"
                />
              </FormControl>
              <FormMessage className="shad-form_message lg:text-base text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label lg:text-base text-xs" htmlFor={"location"}>{t("Add Location")}</FormLabel>
              <FormControl>
                <Input type="text" id={"location"} className="shad-input lg:text-base text-xs" maxLength={15} {...field} />
              </FormControl>
              <FormMessage className="shad-form_message lg:text-base text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label lg:text-base text-xs" htmlFor={"tags"}>
                {t("Add Tags (separated by comma ' , ')")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("Art, Expression, Learn")}
                  type="text"
                  className="shad-input lg:text-base text-xs"
                  id={"tags"}
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message lg:text-base text-xs" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end ">
          <Button
            type="button"
            className="shad-button_dark_4 lg:text-base text-xs"
            onClick={() => navigate(-1)}>
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap lg:text-base text-xs"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action === "Create" ? t("Create Post") : t("Update Post")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
