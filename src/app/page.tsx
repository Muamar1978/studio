import { QrCodeGenerator } from "@/components/features/qr-code-generator/qr-code-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-background to-muted/50 relative">
      <QrCodeGenerator />
      <div className="absolute bottom-4 text-xs text-muted-foreground">
        version: 0.1.0
      </div>
    </main>
  );
}
