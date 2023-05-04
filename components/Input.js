import { db, storage } from "@/firebase";
import { FaceSmileIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, uploadString, ref } from "firebase/storage";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";

export default function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      name: session.user.name,
      username: session.user.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e) => {
    // const fileSize = fileInput.files.item(0).size;
    // const fileMb = fileSize / 1024 ** 2;
    // alert(fileMb);

    const reader = new FileReader();
    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size;
      const fileMb = fileSize / 1024 ** 2;
      if (fileMb > 2) {
        alert("The file size was too large, files must be smaller than 2MB");
      } else {
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    e.target.value = "";
  };

  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            src={session.user.image}
            alt="user image"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
            onClick={signOut}
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows="2"
                placeholder="what's happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative">
                <div
                  className="bg-white h-7 w-7 absolute rounded-full left-2 top-3 cursor-pointer justify-center flex items-center"
                  onClick={() => setSelectedFile(null)}
                >
                  <XMarkIcon className="h-6 text-black" />
                </div>
                <img
                  src={selectedFile}
                  alt="uploaded image"
                  className={`${
                    loading
                      ? "animate-pulse rounded-2xl mr-2"
                      : "rounded-2xl mr-2"
                  }`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex ">
                    <div onClick={() => filePickerRef.current.click()}>
                      <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                    {/* <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" /> */}
                  </div>
                  <button
                    disabled={!input.trim()}
                    className="bg-sky-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    onClick={sendPost}
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
