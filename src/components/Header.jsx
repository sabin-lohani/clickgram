"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Modal from "react-modal";
import { TbCameraPlus } from "react-icons/tb";
import { FaFileUpload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Header() {
  const { data: session } = useSession();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const filePickerRef = useRef(null);
  const db = getFirestore(app);
  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedImage.name;
    const storageRef = ref(storage, fileName);
    try {
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Uploading " + Math.floor(progress) + "%");
          },
          (error) => {
            toast.error(
              "Error uploading image. Make sure image size is less than 2MB"
            );
            console.log(error);
            setIsLoading(false);
            setImageFileUrl(null);
            setSelectedImage(null);
            if (filePickerRef.current) {
              filePickerRef.current.value = null;
            }
            reject(error);
          },
          () => {
            console.log("Upload complete");
            resolve();
          }
        );
      });
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const imageUrl = await uploadImageToStorage();
    if (!imageUrl) return;
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        username: session.user.username,
        caption,
        profileImg: session.user.image,
        image: imageUrl,
        timestamp: serverTimestamp(),
      });
      setIsLoading(false);
      setCaption("");
      setImageFileUrl(null);
      setSelectedImage(null);
      if (filePickerRef.current) {
        filePickerRef.current.value = null;
      }
      setShowPostModal(false);
      toast.success("Post added successfully");
    } catch (error) {
      toast.error("Error adding post");
      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };
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
          <div className="flex gap-2 items-center">
            <TbCameraPlus
              onClick={() => setShowPostModal(true)}
              className="me-5 text-black text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full hidden md:block"
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full md:hidden"
              onClick={signOut}
            />
            <button
              onClick={signOut}
              className="text-sm font-semibold text-red-600 hidden md:block"
            >
              Log Out
            </button>
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
            {selectedImage ? (
              <div className="w-full mt-5 relative">
                <MdClose
                  className="text-2xl text-black cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageFileUrl(null);
                    if (filePickerRef.current) {
                      filePickerRef.current.value = null;
                    }
                  }}
                />
                <img
                  src={imageFileUrl}
                  alt="Selected"
                  className={`w-full max-h-[250px] object-cover cursor-pointer ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                />
              </div>
            ) : (
              <label htmlFor="upload-image">
                <FaFileUpload className="text-5xl text-gray-400 cursor-pointer" />
              </label>
            )}

            <input
              hidden
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={addImageToPost}
              ref={filePickerRef}
              disabled={isLoading}
            />

            <input
              type="text"
              maxLength="150"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="text-black m-4 border-none text-center w-full focus:ring-0 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:hover:brightness-100"
              disabled={isLoading || !selectedImage}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </Modal>
      )}
    </header>
  );
}
