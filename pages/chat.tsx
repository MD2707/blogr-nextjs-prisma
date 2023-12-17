import React, { useState, useEffect } from "react";
import { useSession, getSession } from 'next-auth/react';
import Layout from "../components/Layout";

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
      setMessages(messagesData);
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
      <div className="page">
        <h1>Messages</h1>
        {/* Ajouter un formulaire pour créer un nouveau message */}
        <form onSubmit={(e) => { e.preventDefault(); handleCreateMessage(); }}>
          <input
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Saisissez votre message"
          />
          <button type="submit" disabled={!newMessageText || isSubmitting} >Envoyer</button>
        </form>
        <main>
          {messages.map((message) => (
            <div key={message.id} className="message bg-yellow-500">
            <p>{message.user.name} {message.createdAt} : {message.text}</p>
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Chat;