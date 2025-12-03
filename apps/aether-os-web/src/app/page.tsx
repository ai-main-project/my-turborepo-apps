import Desktop from "@/components/os/Desktop";
import { OSProvider } from "@/context/OSContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Home() {
  return (
    <OSProvider>
      <ThemeProvider>
        <LanguageProvider>
          <main className="h-screen w-screen overflow-hidden">
            <Desktop />
          </main>
        </LanguageProvider>
      </ThemeProvider>
    </OSProvider>
  );
}
