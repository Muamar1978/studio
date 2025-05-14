"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import QRCode from 'qrcode';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode as QrCodeIcon, Download, Save, AlertCircle, ExternalLink } from "lucide-react";
import Image from 'next/image';

export function QrCodeGenerator() {
  const [gdriveLink, setGdriveLink] = useState<string>('');
  const [directLink, setDirectLink] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractFileId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname !== 'drive.google.com') {
        return null;
      }

      // Regex to find file ID from various GDrive URL formats
      const regex = /\/file\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/;
      const match = url.match(regex);

      if (match) {
        return match[1] || match[2] || null;
      }
      return null;
    } catch (e) {
      // Invalid URL
      return null;
    }
  };

  const generateQrCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setQrCodeDataUrl('');
    setDirectLink('');
    setIsLoading(true);

    if (!gdriveLink.trim()) {
      setError('Please enter a Google Drive link.');
      setIsLoading(false);
      return;
    }

    const fileId = extractFileId(gdriveLink);

    if (!fileId) {
      setError('Invalid Google Drive link or unable to extract file ID. Please use a valid shareable link.');
      setIsLoading(false);
      return;
    }

    const newDirectLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    setDirectLink(newDirectLink);

    try {
      const dataUrl = await QRCode.toDataURL(newDirectLink, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 256,
        margin: 2,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('QR Code generation failed:', err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQrCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'alatar-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <QrCodeIcon className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-bold">Alatar QR Generator</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Developed by Muamar Almani , MIE Department, TECK, NTU, 2025.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={generateQrCode} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="gdrive-link" className="text-sm font-medium">Google Drive File Link</label>
            <Input
              id="gdrive-link"
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={gdriveLink}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGdriveLink(e.target.value)}
              required
              aria-label="Google Drive File Link Input"
              className="focus:ring-primary focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <QrCodeIcon className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {qrCodeDataUrl && (
          <div className="mt-8 text-center space-y-4 p-6 bg-muted/30 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground">Your QR Code is Ready!</h3>
            <div className="flex justify-center">
              <Image 
                src={qrCodeDataUrl} 
                alt="Generated QR Code" 
                width={256} 
                height={256} 
                className="rounded-md shadow-md border-2 border-primary p-1 bg-white"
                data-ai-hint="qr code" 
              />
            </div>
            <p className="text-xs text-muted-foreground break-all">
              Direct Link: <a href={directLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{directLink}</a>
            </p>
          </div>
        )}
      </CardContent>
      {(qrCodeDataUrl || directLink) && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          {qrCodeDataUrl && (
             <Button variant="outline" onClick={handleSaveQrCode} className="w-full sm:w-auto">
              <Save className="mr-2 h-5 w-5" />
              Save QR Code (PNG)
            </Button>
          )}
          {directLink && (
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href={directLink} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-5 w-5" />
                Download File
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
