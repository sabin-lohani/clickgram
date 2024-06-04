"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Modal from "react-modal";
import { TbCameraPlus } from "react-icons/tb";
import { FaFileUpload } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function Header() {
  const { data: session } = useSession();
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="hidden lg:inline-flex">
          <Image
            src="/logo-text.png"
            width={96}
            height={96}
            alt="clickgram logo"
          />
        </Link>
        <Link href="/" className="lg:hidden">
          <Image
            src="/logo-img.png"
            width={40}
            height={40}
            alt="clickgram logo"
          />
        </Link>

        <input
          type="search"
          placeholder="Search"
          className="bg-gray-50 text-black border  border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />

        {session?.user ? (
          <div className="flex gap-5 items-center">
            <TbCameraPlus
              onClick={() => setShowPostModal(true)}
              className="text-black text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <button
            className="text-sm font-semibold text-blue-500"
            onClick={signIn}
          >
            Log In
          </button>
        )}
      </div>
      {showPostModal && (
        <Modal
          isOpen={showPostModal}
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          onRequestClose={() => setShowPostModal(false)}
          ariaHideApp={false}
        >
          <MdClose
            className="text-2xl text-black cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300"
            onClick={() => setShowPostModal(false)}
          />
          <div className="flex flex-col justify-center items-center h-[100%]">
            <FaFileUpload className="text-5xl text-gray-400 cursor-pointer" />

            <input
              type="text"
              maxLength="150"
              placeholder="Enter caption"
              className="text-black m-4 border-none text-center w-full focus:ring-0 outline-none"
            />
            <button className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:hover:brightness-100">
              Upload Post
            </button>
          </div>
        </Modal>
      )}
    </header>
  );
}
