import { useCallback, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import CreateRoomModal from "./components/room/CreateRoomModal";
import JoinRoomModal from "./components/room/JoinRoomModal";
import Workspace from "./pages/Workspace";
import SignUp from "./pages/SignUp";
import SignInPage from "./pages/auth/SignInPage";
import Toast from "./components/Toast";
import type { Room } from "./types/workspace";

type View = "landing" | "workspace" | "signup" | "signin";
type ModalKind = "create" | "join" | null;

function App() {
  const [view, setView] = useState<View>("landing");
  const [room, setRoom] = useState<Room | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState<{ message: string; variant: any } | null>(null);

  const closeModal = useCallback(() => setModal(null), []);

  const enterRoom = useCallback((next: Room) => {
    setRoom(next);
    setView("workspace");
  }, []);

  const leaveRoom = useCallback(() => {
    setView("landing");
    setRoom(null);
  }, []);

  const showToast = useCallback((message: string, variant: any = "info") => {
    setToast({ message, variant });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  if (view === "workspace" && room) {
    return <Workspace room={room} onLeave={leaveRoom} />;
  }

  if (view === "signup") {
    return (
      <>
        <SignUp
          onSignUpSuccess={() => {
            setView("landing");
            showToast("Welcome to CollabCode!", "success");
          }}
          showToast={showToast}
        />
        {toast && <Toast message={toast.message} variant={toast.variant} onDismiss={hideToast} />}
      </>
    );
  }

  if (view === "signin") {
    return (
      <>
        <SignInPage
          onSignInSuccess={(user) => {
            showToast(`Welcome back, ${user.username}!`, "success");
            // Mocking a room entry since dashboard isn't built yet
            enterRoom({
              id: "auth-success-room",
              name: "Welcome Room",
              language: "javascript",
            });
          }}
          onNavigateSignUp={() => setView("signup")}
          showToast={showToast}
        />
        {toast && <Toast message={toast.message} variant={toast.variant} onDismiss={hideToast} />}
      </>
    );
  }

  return (
    <>
      <Header
        onSignUpClick={() => setView("signup")}
        onSignInClick={() => setView("signin")}
      />
      <main>
        <Hero onGetStarted={() => setView("signup")} />
        <Features />
      </main>
      <Footer />

      <CreateRoomModal
        open={modal === "create"}
        onClose={closeModal}
        onCreate={enterRoom}
      />
      <JoinRoomModal
        open={modal === "join"}
        onClose={closeModal}
        onJoin={enterRoom}
      />
      {toast && <Toast message={toast.message} variant={toast.variant} onDismiss={hideToast} />}
    </>
  );
}

export default App;
