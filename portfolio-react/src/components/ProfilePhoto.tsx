import { useState } from "react";

const PROFILE_SRC = "../portfolio/images/profile.jpg";

export default function ProfilePhoto({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (failed) {
    return (
      <div className="profile-photo profile-photo-fallback" aria-label={name}>
        {initials}
      </div>
    );
  }

  return (
    <img
      className="profile-photo"
      src={PROFILE_SRC}
      alt={name}
      onError={() => setFailed(true)}
    />
  );
}
