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

import { useSession, signIn, signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();

  const { data: session } = useSession();
  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start h-screen mr-4 sticky top-0">
      {/* Twitter Logo */}
      <div
        className="hoverEffect p-0 hover:bg-blue-100 xl:px-1"
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

      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        {session && (
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

      {session ? (
        <>
          <button className="bg-sky-500 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
            Tweet
          </button>

          {/* Mini-profile */}

          <div className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto w-max">
            <img
              src={session.user.image}
              alt="user image"
              className="rounded-full  max-w-[40px] xl:mr-2"
              onClick={signOut}
            />
            <div className="leading-5 lg:hidden xl:inline mdlg:inline hidden">
              <h4 className="font-bold truncate">{session.user.name}</h4>
              <p className="text-gray-500 truncate">@{session.user.username}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          className="bg-sky-500 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
          onClick={signIn}
        >
          Sign in
        </button>
      )}
    </div>
  );
}
