import React, { useState, useEffect } from "react";
import { useSession, getSession } from 'next-auth/react';
import Layout from "../components/Layout";
import Image from "next/image";

const formatDateTime = (inputDate) => {
  const currentDate = new Date();
  const inputDateTime = new Date(inputDate);

  // Check if the date is today
  if (
    inputDateTime.getDate() === currentDate.getDate() &&
    inputDateTime.getMonth() === currentDate.getMonth() &&
    inputDateTime.getFullYear() === currentDate.getFullYear()
  ) {
    // Return the hours if it's today
    return `${inputDateTime.getHours()}:${inputDateTime.getMinutes()}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);
  if (
    inputDateTime.getDate() === yesterday.getDate() &&
    inputDateTime.getMonth() === yesterday.getMonth() &&
    inputDateTime.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  // For more old dates, return the date in the format DD/MM/YYYY
  const day = inputDateTime.getDate().toString().padStart(2, '0');
  const month = (inputDateTime.getMonth() + 1).toString().padStart(2, '0');
  const year = inputDateTime.getFullYear();

  return `${day}/${month}/${year}`;
};


const fetchMessages = async () => {
  const response = await fetch("/api/messages");
  const data = await response.json();
  return data.messages;
};

const createMessage = async (text) => {
  const response = await fetch("/api/messages/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  });

  if (response.ok) {
    const newMessage = await response.json();
    return newMessage.message;
  } else {
    throw new Error("Erreur lors de la création du message");
  }
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      const messagesData = await fetchMessages();
      setMessages(messagesData.reverse());
    };

    getMessages();
  }, []);

  const handleCreateMessage = async () => {
    try {
      const txt = newMessageText;
      setNewMessageText(""); // Réinitialiser le champ texte après la création du message
      setIsSubmitting(true);
      const newMessage = await createMessage(newMessageText);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const { data: session } = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>Chat</h1>
                <div>You need to be authenticated to view this page.</div>
            </Layout>
        );
    }

  return (
    <Layout>
      <div className="page flex flex-col items-center">
        <main className="h-3/5 overflow-auto">
          {messages.map((message) => (
            <div key={message.id} className="w-fit bg-white py-3 px-6 my-3 rounded-lg shadow-lg">
              <div className="flex flex-row items-center">
                <Image 
                className="rounded-full"
                src={message.user.image}
                alt="Profile image"
                width={50}
                height={50}
                />
                <p className="ml-4">{message.user.name} </p>
              </div>
            <p className="">{message.text}</p>
            <p className=""> {formatDateTime(message.createdAt)}</p>
            </div>
          ))}
        </main>
        <form className="flex flex-row items-center sticky bottom-6 w-fit"
          onSubmit={(e) => { e.preventDefault(); handleCreateMessage(); }}>
          <input
            className=" w-96 h-10 p-2 rounded-lg mr-5 border border-gray-300"
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Saisissez votre message"
          />
          <button type="submit" 
            disabled={!newMessageText || isSubmitting} 
            className="flex flex-row items-center"
            >
            <Image src="/images/icon/send.png" 
              width={25} 
              height={25}/>
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Chat;