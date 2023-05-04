import { SparklesIcon } from "@heroicons/react/24/outline";
import Input from "./Input";
import Post from "./Post";
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { AnimatePresence, motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [postsNumber, setPostsNumber] = useState(6);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  return (
    <div className="border-l border-r xl:min-w-[576px] flex-grow max-w-2xl border-gray-200 justify-center flex flex-col mr-2">
      <div className="flex py-2 px-3 sticky top-0 bg-white border-b border-gray-200 items-center z-40">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect ml-auto w-9 h-9 px-0 flex items-center justify-center">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      <AnimatePresence>
        {posts.slice(0, postsNumber).map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} id={post.id} post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
      {posts.length >= postsNumber ? (
        <button
          className="text-sky-500 pl-4 pb-3 hover:text-sky-600 mt-5 border-b border-gray-200"
          onClick={() => setPostsNumber(postsNumber + 6)}
        >
          Show more
        </button>
      ) : (
        <div className="text-sky-500 pl-4 pb-3 mt-5 border-b border-gray-200 text-center">
          There are no more posts to be shown
        </div>
      )}
    </div>
  );
}
