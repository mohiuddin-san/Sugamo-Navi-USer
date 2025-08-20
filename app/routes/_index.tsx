// app/routes/_index.tsx
import Homepage from "~/components/Home"; // default import

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Homepage />
    </div>
  );
}