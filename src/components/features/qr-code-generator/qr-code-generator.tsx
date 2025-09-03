
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode as QrCodeIcon, Link, File } from "lucide-react";
import { GoogleDriveTab } from './google-drive-tab';
import { DirectLinkTab } from './direct-link-tab';

export function QrCodeGenerator() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [directLink, setDirectLink] = useState<string>('');

  const handleQrGenerated = (dataUrl: string, link: string) => {
    setQrCodeDataUrl(dataUrl);
    setDirectLink(link);
  };

  const handleReset = () => {
    setQrCodeDataUrl('');
    setDirectLink('');
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <QrCodeIcon className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Alatar QR Generator</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Developed by Muamar Almani, MIE Department, TECK, NTU, 2025.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gdrive" className="w-full" onValueChange={handleReset}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gdrive">
              <Link className="mr-2 h-4 w-4" />
              Google Drive
            </TabsTrigger>
            <TabsTrigger value="direct">
              <File className="mr-2 h-4 w-4" />
              Direct Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gdrive">
            <GoogleDriveTab onQrGenerated={handleQrGenerated} qrCodeDataUrl={qrCodeDataUrl} directLink={directLink} />
          </TabsContent>
          <TabsContent value="direct">
            <DirectLinkTab onQrGenerated={handleQrGenerated} qrCodeDataUrl={qrCodeDataUrl} directLink={directLink} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
