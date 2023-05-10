import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import twitterLogo from "../images/Twitter-Logo.png";
import { EllipsisHorizontalIcon, HomeIcon } from "@heroicons/react/24/solid";
import {
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  HashtagIcon,
  InboxIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userAtom";

export default function Sidebar() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useRecoilState(userState);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
            console.log(currentUser);
          }
        };
        fetchUser();
      }
    });
  }, []);

  const onSignOut = () => {
    signOut(auth);
    setCurrentUser(null);
  };

  return (
    <div className="sm:flex flex-col sm:p-2 xl:items-start h-screen sm:mr-4 sticky top-0 z-50">
      {/* Twitter Logo */}
      <div
        className="hoverEffect p-0 hover:bg-blue-100 xl:px-1 hidden sm:inline"
        onClick={() => {
          router.push(`/`);
        }}
      >
        <Image
          width="50"
          height="50"
          src={twitterLogo}
          alt="Twitter logo"
          className="pt-4 pb-4"
        />
      </div>

      {/* Menu */}

      <div className="mt-4 mb-2.5 xl:items-start hidden sm:inline">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        {currentUser && (
          <>
            <SidebarMenuItem text="Notifications" Icon={BellIcon} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            <SidebarMenuItem text="Bookmark" Icon={BookmarkIcon} />
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
            <SidebarMenuItem text="Profile" Icon={UserIcon} />
            <SidebarMenuItem text="More" Icon={EllipsisHorizontalCircleIcon} />
          </>
        )}
      </div>

      {/* Button */}

      {currentUser ? (
        <>
          <button
            className="bg-sky-500 text-white rounded-full w-32 h-8 font-bold shadow-md hover:brightness-95 text-lg absolute xl:inline xl:relative left-[5rem] top-[0.7rem] sm:left-[calc(60%+9rem)] xl:left-0 z-50 xl:w-36 xl:h-12 mdlg:left-[calc(80%+9rem)]"
            onClick={onSignOut}
          >
            Sign out
          </button>

          {/* Mini-profile */}

          <div className="hoverEffect text-gray-700 items-center justify-center xl:justify-start mt-auto w-max hidden sm:flex">
            <img
              src={currentUser?.userImg}
              alt="user image"
              className="rounded-full  max-w-[40px] xl:mr-2"
            />
            <div className="leading-5 lg:hidden xl:inline mdlg:inline hidden">
              <h4 className="font-bold truncate">{currentUser?.name}</h4>
              <p className="text-gray-500 truncate">@{currentUser?.userName}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          className="bg-sky-500 text-white rounded-full w-32 h-8 font-bold shadow-md hover:brightness-95 text-lg absolute xl:inline xl:relative left-[5rem] top-[0.7rem] sm:left-[calc(60%+9rem)] xl:left-0 z-50 xl:w-36 xl:h-12"
          onClick={() => {
            router.push(`/auth/signin`);
          }}
        >
          Sign in
        </button>
      )}
    </div>
  );
}

// w-[calc(100%+2rem)]
