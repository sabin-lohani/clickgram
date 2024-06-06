"use client";
import { app } from "@/lib/firebase";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Post from "./Post";
import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [db]);

  return (
    <div>
      {posts.map((doc) => (
        <Post key={doc.id} post={doc} />
      ))}
    </div>
  );
}
