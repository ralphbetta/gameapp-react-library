import React from 'react'
import { AiOutlineSend } from "react-icons/ai";
import { FiThumbsDown } from "react-icons/fi";
import { FiThumbsUp } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AiFillWechat } from "react-icons/ai";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";


interface ChatMessage {
    user: true | false;
    prompt: string;
    device: string;
    timestamp: string;
}

interface PlaygroundProps {
    uid?: string;
    title?: string;
    caption?: string;
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

 export const Playground: React.FC<PlaygroundProps> = ({ uid = '7', title = 'Oxy Playground', caption = 'Customer Support' }) => {


    const [expand, setExpand] = useState<boolean>(false);
    const [chats, setChats] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const [zoomInIndex, setZoomInIndex] = useState<number | null>(null);
    const [online, setOnline] = useState<boolean>(false);

    const socketRef = useRef(false);


    const chatContainerRef = useRef<HTMLDivElement>(null);


    function handleSubmitEvent(e: FormEvent) {
        e.preventDefault();

        if (!message) return;

        const userprompt: ChatMessage = { user: true, prompt: message, device: getDeviceId(), timestamp: getDateTime() };

        console.log("submitted", userprompt)

        socket.emit("request", userprompt);


        // Update state using functional form to ensure it references the latest state
        setChats((prevChats) => [...prevChats, userprompt]);
        setZoomInIndex(chats.length); // Set the index of the new message for the zoom-in effect
        setMessage("");
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitEvent(e as unknown as FormEvent<HTMLFormElement>);
        }
    };

    useEffect(() => {

        const initializeSocket = (uid: string) => {
            const LIVE_CHANNELMANAGEMENT = "https://api.dev.oxypu.com";
            // const LOCAL_CHANNELMANAGEMENT = "http://localhost:8086";
            const BASECHANNEL =  LIVE_CHANNELMANAGEMENT;
            socket = io(BASECHANNEL, {
                transports: ["websocket"],
                query: { uid, device: getDeviceId() },
            });

            socket.on("connect", () => {
                setOnline(true);
                console.log("socket connected");
                console.log(`${"Helpcenter"} connected to ${BASECHANNEL}`);
            });

            socket.on("status", (message) => {
                console.log("this is the message", message);
            });


            socket.on("disconnect", () => {
                setOnline(false);
            });

            socket.on("response", (message) => {
                console.log("new message-------------", message);
                const oxypuprompt: ChatMessage = { user: false, prompt: message.response, device: 'ai', timestamp: getDateTime() };
                setChats((prevChats) => {
                    const updatedChats = [...prevChats, oxypuprompt];
                    setZoomInIndex(updatedChats.length - 1); // Set the index of the new message
                    return updatedChats;
                });
            });
        };

        if (!socketRef.current) {
            initializeSocket(uid);
            socketRef.current = true;
            console.log('CONNECTED')
        }


    }, [chats]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        if (zoomInIndex !== null) {
            setTimeout(() => setZoomInIndex(null), 300); // Remove the zoom-in class after the animation
        }

    }, [chats, zoomInIndex]);


    const getDeviceId = () => {
        let deviceId = localStorage.getItem("device_id");

        if (!deviceId) {
            deviceId = "device-" + Math.random().toString(36).substr(2, 16);
            localStorage.setItem("device_id", deviceId);
        }

        return deviceId;
    };

    const getDateTime = () => {
        const nowISO = new Date().toISOString();
        return nowISO;
    }


    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const interval = Math.floor(seconds / 31536000); // 1 year in seconds
        if (interval > 1) return `${interval} years ago`;

        const monthInterval = Math.floor(seconds / 2592000); // 1 month in seconds
        if (monthInterval > 1) return `${monthInterval} months ago`;

        const weekInterval = Math.floor(seconds / 604800); // 1 week in seconds
        if (weekInterval > 1) return `${weekInterval} weeks ago`;

        const dayInterval = Math.floor(seconds / 86400); // 1 day in seconds
        if (dayInterval > 1) return `${dayInterval} days ago`;

        const hourInterval = Math.floor(seconds / 3600); // 1 hour in seconds
        if (hourInterval > 1) return `${hourInterval} hours ago`;

        const minuteInterval = Math.floor(seconds / 60); // 1 minute in seconds
        if (minuteInterval > 1) return `${minuteInterval} minutes ago`;

        return `${Math.floor(seconds)} seconds ago`;
    };
  return (
    <form method="post" onSubmit={handleSubmitEvent}>
    <div className={`${expand ? " h-full w-full md:min-w-[380px] md:w-[25%] md:h-[80%]" : "w-0 h-0 overflow-hidden"} transition-all duration-150 bg-slate-100 absolute right-0 bottom-0 md:right-[110px] md:bottom-20 rounded-md flex flex-col justify-between`}>
        <div className="flex items-center justify-between px-5 py-3 border-gray-200 border-b-[1px] bg-white border-[1px] rounded-t-md">
            <div className="flex items-center">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/007/073/218/small/call-center-operator-in-headset-while-consulting-client-telemarketing-or-phone-sales-customer-service-and-business-concept-photo.jpg" alt="" className="w-9 h-9 rounded-full bg-slate-500 mr-5" />
                <div>
                    <p>{title}</p>
                    <p className="text-xs">{caption}</p>
                </div>
            </div>
            <div className={online ? "size-3 bg-green-600 rounded-full" : "hidden"}></div>
            <div className="flex space-x-3">
                <button className="bg-gray-300 size-9 rounded-md flex items-center justify-center"><FiThumbsUp /></button>
                <button className="bg-gray-300 size-9 rounded-md flex items-center justify-center"><FiThumbsDown /></button>

            </div>
        </div>
        <div ref={chatContainerRef} className=" overflow-y-auto px-3 text-sm flex-grow pb-3">
            {/* BODY START */}

            {chats.map((chat: ChatMessage, index: number) => (
                <div key={index} className={`flex ${chat.user === true ? 'justify-end' : 'justify-start'} mt-5 transition-transform duration-300 ease-in-out 
  ${zoomInIndex === index ? 'transform scale-110' : ''}`}>
                    <div className={`inline-block px-3 py-2 max-w-[80%] 
    ${chat.user === true ? 'bg-purple-600 text-gray-100 rounded-es-lg' : 'bg-white rounded-ee-lg'} rounded-ss-lg rounded-se-lg w-auto`}>
                        <div>{chat.prompt}</div>
                        <div className={chat.user === false ? "text-left text-xs text-gray-300" : "text-right text-xs text-gray-300"}>{timeAgo(chat.timestamp)}</div>
                    </div>
                </div>))}


            {/* BODY END */}
        </div>
        <div className=" flex items-center font-light bg-white border-gray-200 border-[1px] rounded-b-md">
            <textarea onChange={(e) => setMessage(e.target.value)} value={message}
                onKeyDown={handleKeyDown}
                rows={2} placeholder="Enter messsage" className="w-full rounded-md pt-2 pl-3 border-none focus:outline-none focus:border-none"></textarea>
            <button className="mx-2">
                <AiOutlineSend className="text-3xl" />
            </button>
        </div>
    </div>

    <button type="button" onClick={() => setExpand((e) => !e)} className="text-white bg-purple-700 h-14 w-14 flex justify-center items-center rounded-full absolute bottom-20 right-10">
        {expand ? <CgClose /> : <AiFillWechat />}
    </button>
</form>
  )
}