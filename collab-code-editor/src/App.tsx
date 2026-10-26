import { useCallback, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import CreateRoomModal from "./components/room/CreateRoomModal";
import JoinRoomModal from "./components/room/JoinRoomModal";
import Workspace from "./pages/Workspace";
import type { Room } from "./types/workspace";

type View = "landing" | "workspace";
type ModalKind = "create" | "join" | null;

function App() {
  const [view, setView] = useState<View>("landing");
  const [room, setRoom] = useState<Room | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);

  const openCreate = useCallback(() => setModal("create"), []);
  const openJoin = useCallback(() => setModal("join"), []);
  const closeModal = useCallback(() => setModal(null), []);

  const enterRoom = useCallback((next: Room) => {
    setRoom(next);
    setView("workspace");
  }, []);

  const leaveRoom = useCallback(() => {
    setView("landing");
    setRoom(null);
  }, []);

  if (view === "workspace" && room) {
    return <Workspace room={room} onLeave={leaveRoom} />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero onCreateRoom={openCreate} onJoinRoom={openJoin} />
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
    </>
  );
}

export default App;