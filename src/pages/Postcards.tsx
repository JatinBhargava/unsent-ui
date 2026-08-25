import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { ArrowLeft, Heart, MailCheck, RotateCw, Send } from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { muiTheme } from "@/theme/mui";
import { sendPostcard } from "../services/Postcard";
import { getUserByEmail } from "../services/Auth";
import { useAuth } from "../contexts/AuthContext";

const MAX_MESSAGE_LENGTH = 1200;

// Deliberately loose: the backend is the authority on deliverability, this
// only catches the obvious typo before a round trip.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Toast = { severity: "success" | "error"; message: string } | null;

export default function Postcards() {
  const navigate = useNavigate();
  const { userId: contextUserId, email } = useAuth();

  const [userId, setUserId] = useState<string | null>(contextUserId);
  const [flipped, setFlipped] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [postcard, setPostcard] = useState({
    toEmail: "",
    toName: "",
    fromName: "",
    message: "",
  });

  // Sign the letter with the sender's display name unless they overwrite it.
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    getUserByEmail(email)
      .then((user) => {
        if (cancelled) return;
        setUserId((current) => current ?? user?.userId ?? null);
        setPostcard((p) =>
          p.fromName ? p : { ...p, fromName: user?.displayName || user?.username || "" },
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [email]);

  const update = (field: keyof typeof postcard) => (value: string) =>
    setPostcard((p) => ({ ...p, [field]: value }));

  const messageProgress = (postcard.message.length / MAX_MESSAGE_LENGTH) * 100;

  const handleSend = async () => {
    const toEmail = postcard.toEmail.trim();

    if (!EMAIL_PATTERN.test(toEmail)) {
      setToast({ severity: "error", message: "Add a valid email address on the front" });
      setFlipped(false);
      return;
    }
    if (!postcard.message.trim()) {
      setToast({ severity: "error", message: "Write something on the back first" });
      setFlipped(true);
      return;
    }

    setSending(true);
    try {
      await sendPostcard({
        toEmail,
        toName: postcard.toName.trim() || undefined,
        fromName: postcard.fromName.trim() || undefined,
        senderId: userId ?? undefined,
        message: postcard.message.trim(),
      });
      setSentTo(toEmail);
      setToast({ severity: "success", message: `Postcard on its way to ${toEmail}` });
    } catch (err) {
      setToast({
        severity: "error",
        message:
          err instanceof Error ? err.message : "Failed to send postcard. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const writeAnother = () => {
    setSentTo(null);
    setFlipped(false);
    setPostcard((p) => ({ ...p, toEmail: "", toName: "", message: "" }));
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-100/25 blur-3xl" />

          <Snackbar
            open={!!toast}
            autoHideDuration={4000}
            onClose={() => setToast(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            {toast ? (
              <Alert
                severity={toast.severity}
                variant="filled"
                onClose={() => setToast(null)}
                className="shadow-lg"
              >
                {toast.message}
              </Alert>
            ) : undefined}
          </Snackbar>

          <div className="relative z-10 w-full max-w-2xl">
            <Navbar />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/diaries")}
              className="mt-6 -ml-3 rounded-full text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft />
              Back to Diaries
            </Button>

            {/* Hero */}
            <div className="mt-6 mb-8 text-center">
              <Chip
                label="SIDE QUEST"
                size="small"
                variant="outlined"
                className="mb-3 border-amber-300 bg-amber-50/70 text-amber-800"
              />
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Postcards to loved ones
              </h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Address the front, turn it over, write the bit you actually mean. It lands
                in their inbox as a letter.
              </p>
            </div>

            {sentTo ? (
              <Zoom in appear>
                <Card className="bg-card/70 backdrop-blur-sm border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-10 text-center">
                  <CardContent className="flex flex-col items-center">
                    <MailCheck className="size-10 text-rose-400" strokeWidth={1.5} />
                    <h2 className="mt-4 text-lg font-semibold text-foreground">Sent</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your postcard is on its way to{" "}
                      <span className="font-medium text-foreground">{sentTo}</span>.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-6 justify-center gap-3">
                    <Button onClick={writeAnother} className="rounded-full">
                      Write another
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/diaries")}
                      className="rounded-full"
                    >
                      Back to Diaries
                    </Button>
                  </CardFooter>
                </Card>
              </Zoom>
            ) : (
              <>
                <div className="letter-scene">
                  <div className={`letter-card h-[27rem] sm:h-[30rem] ${flipped ? "is-flipped" : ""}`}>
                    {/* ---------- Front: the address side ---------- */}
                    <Card
                      className="letter-face rounded-3xl border-white/80 bg-[#fdfbf5] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8"
                      aria-hidden={flipped}
                      inert={flipped}
                    >
                      <CardHeader>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          Unsent · Postcard
                        </p>
                        <Tooltip title="Posted with love, from Unsent" placement="left">
                          <div className="h-14 w-11 sm:h-16 sm:w-12 shrink-0 rounded-[3px] border-2 border-dashed border-rose-200 bg-rose-50/70 flex flex-col items-center justify-center">
                            <Heart className="size-4 text-rose-400" strokeWidth={2} />
                            <span className="mt-1 text-[7px] tracking-widest uppercase text-rose-300">
                              Unsent
                            </span>
                          </div>
                        </Tooltip>
                      </CardHeader>

                      <CardContent className="mt-6 flex flex-1 min-h-0 flex-col sm:flex-row gap-6 sm:gap-8">
                        {/* Left half — the sender */}
                        <div className="flex flex-1 flex-col">
                          <Label
                            htmlFor="postcard-from"
                            className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground"
                          >
                            From
                          </Label>
                          <Input
                            id="postcard-from"
                            value={postcard.fromName}
                            onChange={(e) => update("fromName")(e.target.value)}
                            placeholder="Your name"
                            className="mt-2 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-ring focus-visible:ring-0"
                          />
                          <p className="mt-auto hidden sm:block text-xs text-muted-foreground leading-relaxed">
                            Some things are easier to post than to say. Fill in where it's
                            going, then turn the card over.
                          </p>
                        </div>

                        <Divider orientation="vertical" flexItem className="hidden sm:block" />

                        {/* Right half — the address */}
                        <div className="flex flex-1 flex-col">
                          <Label
                            htmlFor="postcard-to-name"
                            className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground"
                          >
                            To
                          </Label>
                          <Input
                            id="postcard-to-name"
                            value={postcard.toName}
                            onChange={(e) => update("toName")(e.target.value)}
                            placeholder="Their name (optional)"
                            className="mt-2 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-ring focus-visible:ring-0"
                          />
                          <Tooltip title="This is the inbox the letter is delivered to" placement="bottom-start">
                            <Input
                              id="postcard-to-email"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              value={postcard.toEmail}
                              onChange={(e) => update("toEmail")(e.target.value)}
                              placeholder="their@email.com"
                              className="mt-4 rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:border-ring focus-visible:ring-0"
                            />
                          </Tooltip>
                          <div className="mt-4 space-y-2.5" aria-hidden="true">
                            <div className="h-px bg-border/70" />
                            <div className="h-px bg-border/70" />
                            <div className="h-px w-2/3 bg-border/70" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ---------- Back: the letter ---------- */}
                    <Card
                      className="letter-face letter-face--back rounded-3xl border-white/80 bg-[#fdfbf5] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8"
                      aria-hidden={!flipped}
                      inert={!flipped}
                    >
                      <CardContent className="flex flex-1 min-h-0 flex-col">
                        <p className="text-sm text-foreground">
                          Dear {postcard.toName.trim() || "you"},
                        </p>
                        <Textarea
                          value={postcard.message}
                          maxLength={MAX_MESSAGE_LENGTH}
                          onChange={(e) => update("message")(e.target.value)}
                          placeholder="Write the thing you keep meaning to say…"
                          className="letter-ruled mt-3 min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-0 text-sm leading-[28px] shadow-none focus-visible:ring-0"
                        />
                      </CardContent>
                      <CardFooter className="mt-3 flex-col items-stretch gap-2 border-t border-border/80 pt-3">
                        <div className="flex items-end justify-between gap-4">
                          <p className="truncate text-sm text-foreground">
                            — {postcard.fromName.trim() || "me"}
                          </p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {postcard.message.length}/{MAX_MESSAGE_LENGTH}
                          </span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(messageProgress, 100)}
                          color={messageProgress > 90 ? "secondary" : "primary"}
                        />
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Tooltip title={flipped ? "Back to the address side" : "Flip the card and write"}>
                    <Button
                      variant="outline"
                      onClick={() => setFlipped((f) => !f)}
                      className="rounded-full text-xs"
                    >
                      <RotateCw />
                      {flipped ? "Turn to the address" : "Turn over and write"}
                    </Button>
                  </Tooltip>

                  <Button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full rounded-full px-6 text-xs sm:w-auto"
                  >
                    {sending ? (
                      <CircularProgress size={14} thickness={5} className="text-white" />
                    ) : (
                      <Send />
                    )}
                    {sending ? "Posting…" : "Post it"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
