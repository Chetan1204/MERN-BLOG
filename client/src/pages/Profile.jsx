import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import { getEnv } from "@/helpers/getEnv";

import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";
const Profile = () => {
  const [filePreview, setPreview] = useState();
  const [userPicture, setUserPicture] = useState();
  const user = useSelector((state) => state.user);
  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    `http://localhost:3000/api/user/get-user?userid=${user.user._id}`,
    { method: "get" }
  );

  const dispatch = useDispatch();
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long."),
    email: z.string().email(),
    bio: z.string().min(3, "Bio must be at least 3 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
      });
    }
  }, [userData]);

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setUserPicture(file);
    setPreview(preview);
  };

  const onSubmit = async (values) => {
    try {
      if (!userPicture || !(userPicture instanceof File)) {
        throw new Error("Invalid file selected");
      }
      const formData = new FormData();
      formData.append("file", userPicture);
      formData.append("data", JSON.stringify(values));
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData._id}`,
        formData,
        config
      );
      console.log(response);

      // dispatch(setUser(data.user));

      showToast("success", response?.data?.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  if (loading) return <Loading />;
  return (
    <Card className="max-w-screen-md mx-auto">
      <CardContent>
        <div className="flex justify-center items-center mt-10 ">
          <Dropzone
            onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage
                    src={filePreview ? filePreview : userData?.user?.avatar}
                  />
                  <div
                    className="absolute z-50 w-full h-full top-1/2 left-1/2
   -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black bg-opacity-20
   border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer "
                  >
                    <FaCamera color="#7c3aed" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your Bio" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
