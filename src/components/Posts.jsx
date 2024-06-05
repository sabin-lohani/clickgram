import { app } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import Post from "./Post";

export default async function Posts() {
  const db = getFirestore(app);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  return (
    <div>
      {querySnapshot.docs.map((doc) => (
        <Post key={doc.id} post={doc.data()} />
      ))}
    </div>
  );
}
