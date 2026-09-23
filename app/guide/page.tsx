import Link from "next/link";

export default function GuidePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
        color: "#f9f1f1",
      }}
    >
      <h1>Guide</h1>
      <Link href="/" style={{ color: "#19cb69" }}>
        Home
      </Link>
    </main>
  );
}
