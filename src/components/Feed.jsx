import MiniProfile from "./MiniProfile";
import Posts from "./Posts";

export default function Feed() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 md:max-w-6xl mx-auto p-3">
      <section className="lg:col-span-2">
        <Posts />
      </section>
      <section className="hidden lg:inline-grid md:col-span-1">
        <div className="fixed">
          <MiniProfile />
        </div>
      </section>
    </main>
  );
}
