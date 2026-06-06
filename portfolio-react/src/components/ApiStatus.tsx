import { useEffect, useState } from "react";
import { checkApiHealth } from "../api/portfolioApi";

export default function ApiStatus() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then(setOnline);
  }, []);

  if (online === null) return null;

  return (
    <p className={`api-status ${online ? "api-online" : "api-offline"}`}>
      {online
        ? "✓ API connected — Express server online (Lesson 20–21)"
        : "⚠ API offline — start: cd backend-api → npm start"}
    </p>
  );
}
