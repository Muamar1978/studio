import { QrCodeGenerator } from "@/components/features/qr-code-generator/qr-code-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-background to-muted/50 relative">
      <QrCodeGenerator />
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground space-y-1">
        <div>version: 1.2.1</div>
        <div>Developed by Muamar Almani, MIE Department, TECK, NTU, 2025.</div>
      </div>
    </main>
  );
}
