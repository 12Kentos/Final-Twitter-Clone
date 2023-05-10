import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Moment from "react-moment";
import { useRouter } from "next/router";
import { userState } from "@/atom/userAtom";

export default function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const [input, setInput] = useState("");
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot);
    });
  }, [postId, db]);

  const sendComment = async () => {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: currentUser.name,
      username: currentUser.userName,
      userImg: currentUser.userImg,
      timestamp: serverTimestamp(),
      userId: currentUser.uid,
    });

    setOpen(false);
    setInput("");
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="z-50">
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-2xl w-[80%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-1 border-gray-500 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center hover:cursor-pointer"
              >
                <XMarkIcon className="text-gray-700 h-6" />
              </div>
            </div>
            <div className="p-2 flex items-center space-x-2 relative">
              <img
                className="h-11 w-11 rounded-full mr-4"
                src={post?.data()?.userImg}
                alt="user image"
              />
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.data()?.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{post?.data()?.username} -{" "}
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <div className="relative">
              <p className="text-gray-500 text-[15px] sm:text-[16px] ml-[70px] mb-2">
                {post?.data()?.text}
              </p>
              <span className="w-1 h-[calc(100%+2rem)] z-[-1] absolute left-7 top-[-10px] bg-gray-300" />
            </div>
            {/* Top half ^*/}
            <>
              <div className="flex p-2 space-x-3">
                <img
                  src={currentUser.userImg}
                  alt="user image"
                  className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
                />
                <div className="w-full divide-y divide-gray-200">
                  <div className="">
                    <textarea
                      className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                      rows="2"
                      placeholder="Tweet your reply"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end pt-2.5">
                    {/* <div className="flex ">
                        <div
                        onClick={() => filePickerRef.current.click()}
                        >
                          <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                          <input
                            type="file"
                            hidden
                            ref={filePickerRef}
                            onChange={addImageToPost}
                          />
                        </div>
                        <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      </div> */}
                    <button
                      disabled={!input.trim()}
                      className="bg-sky-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                      onClick={sendComment}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          </div>
        </Modal>
      )}
    </div>
  );
}
