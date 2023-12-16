import React, { useState, useEffect } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const [reactions, setReactions] = useState([]);
  const [newReactionContent, setNewReactionContent] = useState("");
  
  const authorName = post.author ? post.author.name : "Unknown author";

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/reactions/${post.id}`);
        const data = await response.json();
        setReactions(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réactions', error);
      }
    };

    fetchReactions();
  }, [post.id]);

  const handleAddReaction = async () => {
    try {
      const response = await fetch('/api/reactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id, content: newReactionContent }),
      });
      const data = await response.json();
      setReactions([...reactions, data]);
      setNewReactionContent("");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction', error);
    }
  };

  return (
    <div>
      <div  onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
        <h2>{post.title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown children={post.content} />
      </div>
      <div>
        <h3>Réactions :</h3>
        <ul>
          {reactions.map((reaction) => (
            <li key={reaction.id}>{reaction.content}</li>
          ))}
        </ul>
        <div>
          <h4>Ajouter une réaction :</h4>
          <input
            type="text"
            placeholder="Votre réaction..."
            value={newReactionContent}
            onChange={(e) => setNewReactionContent(e.target.value)}
          />
          <button onClick={handleAddReaction}>Ajouter</button>
        </div>
      </div>

      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;