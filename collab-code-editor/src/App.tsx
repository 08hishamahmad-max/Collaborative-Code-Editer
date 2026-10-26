import { useState, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Workspace from "./pages/Workspace";

type View = "landing" | "workspace";

function App() {
  const [view, setView] = useState<View>("landing");

  const goToWorkspace = useCallback(() => setView("workspace"), []);
  const goToLanding = useCallback(() => setView("landing"), []);

  if (view === "workspace") {
    return <Workspace onLeave={goToLanding} />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero onCreateRoom={goToWorkspace} onJoinRoom={goToWorkspace} />
        <Features />
      </main>
      <Footer />
    </>
  );
}

export default App;