"use client";

import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { app } from "@/lib/firebase";

export default function LikeSection({ id }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    if (likes?.findIndex((like) => like.id === session?.user?.uid) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  async function handleButtonClick() {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session?.user?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session?.user?.uid), {
        username: session?.user?.username,
      });
    }
  }

  return (
    <div>
      {session && (
        <div className="flex border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-1">
            {liked ? (
              <HiHeart
                onClick={handleButtonClick}
                className="text-red-500 cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out"
              />
            ) : (
              <HiOutlineHeart
                onClick={handleButtonClick}
                className="cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out"
              />
            )}
            {likes.length > 0 && (
              <p className="text-gray-500">
                {likes.length} like{likes.length > 1 && "s"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
