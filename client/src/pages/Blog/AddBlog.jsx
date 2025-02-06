import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import axios from "axios";
import { showToast } from "@/helpers/showToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";

const AddBlog = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });
  const [filePreview, setPreview] = useState();
  const [userPicture, setUserPicture] = useState();

  const formSchema = z.object({
    category: z.string().min(1, "category is a required"),
    title: z.string().min(3, "Title must be at least 3 character long"),
    slug: z.string().min(3, "slug must be at least 3 character long"),
    blogContent: z.string().min(1, "Blog content is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
      author: "",
    },
  });

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    form.setValue("blogContent", data);
  };
  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  const onSubmit = async (values) => {
    try {
      const newValues = {...values, author: user.user._id}
      if (!userPicture || !(userPicture instanceof File)) {
        throw new Error("Invalid file selected");
      }

     
      const mergedValues = { ...newValues, ...values };
      const formData = new FormData();
      formData.append("file", userPicture);
      formData.append('data', JSON.stringify(mergedValues))


      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(
        `${getEnv("VITE_API_BASE_URL")}/blog/add`,
           formData,
           config
      );
       
      if (response.status !== 200) {
        return showToast("error", response?.data?.message);
      }
      form.reset();
      setPreview();
      navigate(RouteBlog);
      showToast("success", response?.data?.message);
      console.log(">>>yeh hu mai")
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setUserPicture(file);
    setPreview(preview);
  };

  return (
    <div>
      <Card className="pt-5 ">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3"></div>

              <div className="mb-3">
                <span className="mb-2 block">Featured Image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div
                        className="flex justify-center items-center w-36
                             h-28 border-2 border-dashed rounded"
                      >
                        <img src={filePreview} />
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content</FormLabel>
                      <FormControl>
                        <Editor
                          props={{
                            initialData: "",
                            onChange: handleEditorData,
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
