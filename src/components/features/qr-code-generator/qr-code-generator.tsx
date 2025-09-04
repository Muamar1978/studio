
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode as QrCodeIcon, Link as LinkIcon, FileText } from "lucide-react";
import { GoogleDriveTab } from './google-drive-tab';
import { WebsiteUrlTab } from './website-url-tab';

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
          Generate QR codes for Google Drive files, folders, and website URLs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gdrive" className="w-full" onValueChange={handleReset}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gdrive">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10.4 12.6-2.8 5.2"></path><path d="m16.8 17.8-2.8-5.2"></path><path d="m11.25 15.2 4.5 0"></path></svg>
              Google Drive
            </TabsTrigger>
            <TabsTrigger value="website">
              <LinkIcon className="mr-2 h-4 w-4" />
              Website URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gdrive">
            <GoogleDriveTab onQrGenerated={handleQrGenerated} qrCodeDataUrl={qrCodeDataUrl} directLink={directLink} />
          </TabsContent>
          <TabsContent value="website">
            <WebsiteUrlTab onQrGenerated={handleQrGenerated} qrCodeDataUrl={qrCodeDataUrl} directLink={directLink} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
