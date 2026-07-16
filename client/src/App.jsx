import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Backend already returns nested Prisma relation data. Your job is to make
        <code> ThreadItem.jsx </code>render that shape correctly.
      </p>
      <ThreadList />
    </div>
  );
}
