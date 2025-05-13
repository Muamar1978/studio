import { QrCodeGenerator } from "@/components/features/qr-code-generator/qr-code-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-background to-muted/50">
      <QrCodeGenerator />
    </main>
  );
}
