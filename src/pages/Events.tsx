import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

interface EventPost {
  id: number;
  title: string;
  place: string;
  date: string;
  amount: string;
  organizer: string;
  notes: string;
  interestedCount: number;
  createdAt: string;
}

const STORAGE_KEY = "unsent-events";
const INTEREST_STORAGE_KEY = "unsent-events-interested";
const SAMPLE_EVENT: EventPost = {
  id: 1010,
  title: "Sunset Journaling Circle",
  place: "Lodhi Garden, New Delhi",
  date: "2026-06-14",
  amount: "199",
  organizer: "Unsent Community",
  notes:
    "Bring a notebook. We will do a quiet writing session, reflective prompts, and open sharing.",
  interestedCount: 12,
  createdAt: "2026-05-25T00:00:00.000Z",
};

export default function Events() {
  const [events, setEvents] = useState<EventPost[]>([]);
  const [interestedIds, setInterestedIds] = useState<number[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    place: "",
    date: "",
    amount: "",
    organizer: "",
    notes: "",
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    const savedInterested = localStorage.getItem(INTEREST_STORAGE_KEY);

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Failed to parse saved events", error);
      }
    } else {
      setEvents([SAMPLE_EVENT]);
    }

    if (savedInterested) {
      try {
        setInterestedIds(JSON.parse(savedInterested));
      } catch (error) {
        console.error("Failed to parse interested events", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(INTEREST_STORAGE_KEY, JSON.stringify(interestedIds));
  }, [interestedIds]);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.place || !form.date) return;

    const newEvent: EventPost = {
      id: Date.now(),
      title: form.title.trim(),
      place: form.place.trim(),
      date: form.date,
      amount: form.amount.trim(),
      organizer: form.organizer.trim() || "Anonymous",
      notes: form.notes.trim(),
      interestedCount: 0,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);
    setForm({
      title: "",
      place: "",
      date: "",
      amount: "",
      organizer: "",
      notes: "",
    });
    setShowPostForm(false);
  };

  const toggleInterested = (eventId: number) => {
    const isInterested = interestedIds.includes(eventId);

    setInterestedIds((prev) =>
      isInterested ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );

    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        const nextCount = isInterested
          ? Math.max(0, event.interestedCount - 1)
          : event.interestedCount + 1;

        return { ...event, interestedCount: nextCount };
      })
    );
  };

  const shareEvent = async (event: EventPost) => {
    const shareText = `${event.title} at ${event.place} on ${new Date(
      event.date
    ).toLocaleDateString()}${event.amount ? ` | Pay: INR ${event.amount}` : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fall back to clipboard below.
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      alert("Event details copied to clipboard");
    } catch {
      alert("Sharing not available on this browser");
    }
  };

  const getQrUrl = (event: EventPost) => {
    const payload = `UPI PAY\\nEvent: ${event.title}\\nAmount: INR ${
      event.amount || "0"
    }\\nOrganizer: ${event.organizer}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      payload
    )}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="w-full max-w-5xl">
        <Navbar />

        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Community <span className="italic">Events</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Anyone can post. Everyone can discover. Mark interest, support the
            event, and share it forward.
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80 sm:mb-10 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              Post an Event
            </h2>
            <button
              type="button"
              onClick={() => setShowPostForm((prev) => !prev)}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
            >
              {showPostForm ? "Close Form" : "Create Event"}
            </button>
          </div>

          {showPostForm && (
            <form
              onSubmit={handleCreateEvent}
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Event title"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              required
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              placeholder="Place"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Pay amount (INR)"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              placeholder="Organizer name"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 sm:col-span-2"
            />
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Short details"
              rows={3}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 sm:col-span-2"
            />

            <button
              type="submit"
              className="sm:col-span-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
            >
              Publish Event
            </button>
            </form>
          )}
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedEvents.length === 0 && (
            <div className="col-span-full rounded-3xl border border-gray-200/80 bg-white/80 p-8 text-center text-gray-500">
              No events yet. Be the first to post one.
            </div>
          )}

          {sortedEvents.map((event) => {
            const isInterested = interestedIds.includes(event.id);

            return (
              <article
                key={event.id}
                className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                  {event.title}
                </h3>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Place:</span> {event.place}
                  </p>
                  <p>
                    <span className="font-medium">Organizer:</span> {event.organizer}
                  </p>
                  {event.amount && (
                    <p>
                      <span className="font-medium">Pay:</span> INR {event.amount}
                    </p>
                  )}
                </div>

                {event.notes && (
                  <p className="mt-3 rounded-2xl bg-stone-100/70 px-3 py-2 text-sm leading-relaxed text-gray-700">
                    {event.notes}
                  </p>
                )}

                {event.amount && (
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Pay QR
                    </p>
                    <img
                      src={getQrUrl(event)}
                      alt={`Payment QR for ${event.title}`}
                      className="h-36 w-36 rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleInterested(event.id)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      isInterested
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isInterested ? "Interested ✓" : "I’m Interested"}
                  </button>

                  <button
                    onClick={() => shareEvent(event)}
                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
                  >
                    Share
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  {event.interestedCount} people interested
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
