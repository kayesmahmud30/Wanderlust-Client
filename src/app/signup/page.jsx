"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image,
    });

    if (data) {
      redirect("/");
    }
    if (error) {
      // Toast
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center my-3">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p>Start your adventure with Wanderlust</p>
      </div>
      <Card className="border rounded-none">
        <Form onSubmit={onSubmit} className="flex w-96 flex-col gap-4">
          <TextField isRequiredF name="name" type="text">
            <Label>Name</Label>
            <Input placeholder="Enter Your Name" />
            <FieldError />
          </TextField>

          <TextField name="image" type="url">
            <Label>Image URL</Label>
            <Input placeholder="Enter Image URL" />
            <FieldError />
          </TextField>

          <TextField
            isRequiredF
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>
          <div className="flex justify-center gap-2">
            <Button className={"rounded-none w-full bg-cyan-500"} type="submit">
              Create account
            </Button>
          </div>
        </Form>

        <div className="flex justify-center items-center gap-3">
          <Separator />
          <div className="whitespace-nowrap">Or Sign up with</div>
          <Separator />
        </div>

        <div>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className={"w-full rounded-none"}
          >
            {" "}
            <FcGoogle /> Sign Up with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
