"use client";

import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ImageIcon, SendHorizonal } from "lucide-react";
import MessageInput from "./MessageInput";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UploadButton } from "@/lib/uploadthing";

const ChatForm = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { conversationId } = useConversation();

  const form = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (data: FieldValues) => {
      await axios.post("/api/chat/messages", {
        ...data,
        conversationId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send the message.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: false });
    sendMessage(data);
  };

  const handleUpload = (result: any) => {
    const imageUrl = result[0]?.url;

    if (imageUrl) {
      axios
        .post("/api/chat/messages", {
          image: imageUrl,
          conversationId,
        })
        .then(() => {
          toast({
            title: "Image uploaded",
            description: "Your image has been uploaded successfully.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to upload the image.",
            variant: "destructive",
          });
          console.error(error);
        });
    }
  };

  return (
    <div className="py-4 px-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex items-center gap-2 lg:gap-4 w-full">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <FormField
            name="message"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Type a message..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="rounded-full p-2 bg-cyan-500 dark:bg-cyan-700 cursor-pointer hover:bg-cyan-600 dark:hover:bg-cyan-800 transition"
              >
                <ImageIcon size={20} className="text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Upload an image to the conversation.
              </DialogDescription>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleUpload}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Error",
                    description: "Failed to upload image.",
                    variant: "destructive",
                  });
                  console.error(error);
                }}
              ></UploadButton>
              <DialogClose asChild>
                <Button className="mt-4 rounded-full p-2 bg-gray-500 dark:bg-gray-700 cursor-pointer hover:bg-gray-600 dark:hover:bg-gray-800 transition">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Button
            type="submit"
            className="rounded-full p-2 bg-cyan-500 dark:bg-cyan-700 cursor-pointer hover:bg-cyan-600 dark:hover:bg-cyan-800 transition"
          >
            <SendHorizonal size={20} className="text-white" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatForm;
