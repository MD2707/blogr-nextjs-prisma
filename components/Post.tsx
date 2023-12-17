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
  const [isHidden, setIsHidden] = useState(true);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

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
      const txt = newReactionContent;
      setNewReactionContent("");
      const response = await fetch('/api/reactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id, content: txt }),
      });
      const data = await response.json();
      setReactions([...reactions, data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction', error);
    }
  };

  return (
    <div className="bg-white border rounded-sm max-w-md shadow-md m-10">
      <div className="flex items-center m-5">
        <img className="h-12 w-12 rounded-full" src="https://picsum.photos/id/1027/150/150"/>
        <div className="ml-3 ">
          <span className="text-sm font-semibold antialiased block leading-tight">{post.title}</span>
          <span className="text-gray-600 text-xs block">By {authorName}</span>
        </div>
      </div>
      <div className="px-4 max-h-80 overflow-y-scroll" onClick={() => Router.push("/p/[id]", `/p/${post.id}`)} >
        <ReactMarkdown children={post.content} />
      </div>
      <div className="flex items-center justify-end m-5">
        <div className="flex gap-5">
          <svg onClick={() => toggleHidden()} fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
        </div>
      </div>
      <div className={`px-4 ${isHidden ? 'hidden' : ''}`}>
      <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <ul className="max-h-40 overflow-y-scroll">
          {reactions.map((reaction) => (
            <li key={reaction.id}>{reaction.content}</li>
          ))}
        </ul>
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            className="relative m-0 block min-w-0 flex-auto  border-b border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-t-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            aria-label="Search"
            placeholder="Votre réaction..."
            value={newReactionContent}
            onChange={(e) => setNewReactionContent(e.target.value)}
            aria-describedby="button-addon2" />

          <span
            onClick={ () => { !!newReactionContent ? handleAddReaction() : console.log('empty')}}
            className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
            id="basic-addon2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;