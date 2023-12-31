import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading, t } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: t("Sign up failed. Please try again."), });

        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: t("Something went wrong. Please login your new account"), });

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: t("Login failed. Please try again."), });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col z-10">
        <img
          src="/assets/images/logo.png"
          alt="logo"
          height="70"
          width="70"
        />

        <h2 className="h3-bold md:h2-bold px-3">
          {t("Create a new account")}
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 px-3">
          {t("To use writebomb, Please enter your details")}
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-2 w-full mt-4 px-3 pb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.name && (
                  <FormMessage>{form.formState.errors.name.message}</FormMessage>
                )}
                {!form.formState.errors.name && (
                  <FormLabel className="shad-form_label">{t("Name")}</FormLabel>
                )}
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.username && (
                  <FormMessage>{form.formState.errors.username.message}</FormMessage>
                )}
                {!form.formState.errors.username && (
                  <FormLabel className="shad-form_label">{t("Username")}</FormLabel>
                )}
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.email && (
                  <FormMessage>{form.formState.errors.email.message}</FormMessage>
                )}
                {!form.formState.errors.email && (
                  <FormLabel className="shad-form_label">Email</FormLabel>
                )}
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.password && (
                  <FormMessage >{form.formState.errors.password.message}</FormMessage>
                )}
                {!form.formState.errors.password && (
                  <FormLabel className="shad-form_label">{t("Password")}</FormLabel>
                )}
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

              </FormItem>
            )}
          />


          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> {t("Loading...")}
              </div>
            ) : (
              t("Sign Up")
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            {t("Already have an account?")}
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              {t("Log in")}
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
