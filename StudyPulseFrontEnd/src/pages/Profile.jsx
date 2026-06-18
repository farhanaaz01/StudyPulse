import { useCallback, useEffect, useMemo, useState } from "react";
import { getHistoryApi } from "../api/sessionApi";
import { getCurrentUserApi } from "../api/userApi";
import ProfileStats from "../components/ProfileStats";
import ProfileSummary from "../components/ProfileSummary";

const fallbackProfile = {
  name: "StudyPulse Student",
  email: "student@studypulse.local",
  joinedDate: "Recently",
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return value || "Not available";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDuration = (seconds = 0) => {
  const safeSeconds = Number(seconds) || 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

function Profile() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const [profileResponse, historyResponse] = await Promise.allSettled([
        getCurrentUserApi(),
        getHistoryApi(),
      ]);

      if (profileResponse.status === "fulfilled") {
        setProfile({
          ...fallbackProfile,
          ...profileResponse.value.data,
        });
      } else {
        setIsFallback(true);
      }

      if (historyResponse.status === "fulfilled" && Array.isArray(historyResponse.value.data)) {
        setSessions(historyResponse.value.data);
      }
    } catch (error) {
      console.error(error);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProfile, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchProfile]);

  const totalStudySeconds = useMemo(() => {
    return sessions.reduce(
      (total, session) => total + Number(session.durationSeconds ?? session.duration ?? 0),
      0
    );
  }, [sessions]);

  const joinedDate = useMemo(() => {
    if (profile.joinedDate || profile.createdAt) {
      return formatDate(profile.joinedDate ?? profile.createdAt);
    }

    const firstSessionDate = sessions
      .map((session) => toDate(session.date ?? session.createdAt ?? session.startTime))
      .filter(Boolean)
      .sort((a, b) => a - b)[0];

    return firstSessionDate ? formatDate(firstSessionDate) : "Not available";
  }, [profile, sessions]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      {loading ? (
        <section className="glass-card rounded-2xl p-8">
          <div className="mb-6 h-24 w-24 rounded-3xl shimmer" />
          <div className="h-8 w-64 rounded-full shimmer" />
          <div className="mt-4 h-5 w-80 max-w-full rounded-full shimmer" />
        </section>
      ) : (
        <ProfileSummary
          name={profile.name || fallbackProfile.name}
          email={profile.email || fallbackProfile.email}
          joinedDate={joinedDate}
          isFallback={isFallback}
        />
      )}

      <ProfileStats
        totalSessions={loading ? "..." : sessions.length}
        totalStudyTime={loading ? "..." : formatDuration(totalStudySeconds)}
      />

      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#b4c5ff]/10 p-2 text-[#b4c5ff]">
            <span className="material-symbols-outlined">verified_user</span>
          </span>
          <div>
            <h2 className="font-semibold text-[#dde2f8]">JWT Secured Profile</h2>
            <p className="text-sm text-[#c3c6d7]">
              Profile details are loaded with your existing authenticated StudyPulse session.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
