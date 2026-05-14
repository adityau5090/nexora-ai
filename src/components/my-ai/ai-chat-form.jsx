"use client"
import { Textarea } from '../ui/textarea';
import React, { useState, useEffect } from 'react'
import { useGenerateImage } from '@/modules/chat/hooks/chat';
import { toast } from "sonner";
import Image from 'next/image';
import { Spinner } from '../ui/spinner';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';


const AIchatform = () => {
    const [message, setMessage] = useState("");   // input field
    const [messages, setMessages] = useState([]); // chat history ✅
    const [image, setImage] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)


    const { mutateAsync, isPending } = useGenerateImage();

    const handleDownload = (base64Image, index) => {
        const link = document.createElement("a");
        link.href = base64Image;
        link.download = `ai-image-${index}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const userMessage = {
            type: "user",
            content: message,
        };

        // add user message
        setMessages((prev) => [...prev, userMessage]);

        try {
            const res = await mutateAsync({
                prompt: message,
            });

            if (res?.success) {
                const aiMessage = {
                    type: "image",
                    content: `data:image/png;base64,${res.image}`,
                };

                // add image message
                setMessages((prev) => [...prev, aiMessage]);
            }

        } catch (error) {
            toast.error(error.message);
            const errorMessage = {
                type: "error",
                content: "This prompt cannot be used. Please avoid unsafe or explicit content",
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setMessage(""); // clear input only
        }
    };
    return (
        <main>
            <h1 className='text-xl font-bold flex justify-center py-3'>Generates images here ...</h1>
            <div className="h-[65vh] overflow-y-auto bg-zinc-100 dark:bg-zinc-900 mb-5 max-w-[70vw] mx-auto p-4 space-y-4 rounded-xl">

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {msg.type === "user" && (
                            <div className="bg-pink-100 text-pink-800/70 dark:bg-zinc-800 dark:text-white px-4 py-2 rounded-2xl max-w-[60%]">
                                {msg.content}
                            </div>
                        )}

                        {msg.type === "image" && (
                            <div className="flex flex-col items-start gap-2 relative">
                                <Image
                                src={msg.content}
                                alt="Generated"
                                width={300}
                                height={300}
                                unoptimized
                                className="rounded-xl shadow-lg"
                                />

                                <button
                                onClick={() => handleDownload(msg.content, index)}
                                className="text-sm hover:cursor-pointer text-white px-2 py-1 rounded-lg absolute right-0"
                                >
                                <Download className='w-5 h-5' />
                                </button>
                            </div>
                        )}

                        {msg.type === "error" && (
                            <div className="bg-pink-100 text-zinc-800/70 dark:bg-zinc-800 dark:text-zinc-400 px-4 py-2 rounded-2xl max-w-[60%]">
                                {msg.content}
                            </div>
                        )}

                    </div>
                ))}


                {isPending && (
                    <div className="flex justify-start">
                        <p className="animate-pulse text-gray-400 flex gap-1 items-center justify-center">
                            🎨 Generating image... <Spinner />
                        </p>
                    </div>
                )}

                

            </div>
            <form onSubmit={handleSubmit}
                className='max-h-50 max-w-4xl mx-auto  rounded-2xl'>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className={"min-h-15  resize-none  rounded-b-none rounded-2xl border-2 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e)
                        }
                    }}
                />
                <div className='flex items-center justify-end gap-2 px-3 py-2 border-t'>
                    {/* Model Selector */}

                    <Button
                        type="submit"
                        disabled={!message.trim() || isPending}
                        size="sm"
                        variant={message.trim() ? "default" : "ghost"}
                        className={"h-8 w-8 p-0 rounded-full"} >
                        {isPending ? (<>  <Spinner /> </>) : (
                            <>
                                <Send className='h-4 w-4' />
                                <span className='sr-only'>Send message</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </main>
    )
}

export default AIchatform
