"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { QrCode as QrCodeIcon, Download, Save, AlertCircle } from "lucide-react";
import Image from 'next/image';
import { CardFooter } from '@/components/ui/card';
import { generateQrCodeWithLogo } from '@/lib/qr-code-utils';

interface WebsiteUrlTabProps {
    onQrGenerated: (dataUrl: string, link: string) => void;
    qrCodeDataUrl: string;
    directLink: string;
}

export function WebsiteUrlTab({ onQrGenerated, qrCodeDataUrl, directLink }: WebsiteUrlTabProps) {
  const [fileLink, setFileLink] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrForegroundColor, setQrForegroundColor] = useState<string>('#000000');
  const [customLogo, setCustomLogo] = useState<File | null>(null);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB limit
        setError("Logo image must be less than 1MB.");
        e.target.value = ''; // Reset file input
        return;
      }
      setCustomLogo(file);
      onQrGenerated('', '');
      setError('');
    } else {
        setCustomLogo(null);
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const generateQrCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    onQrGenerated('', '');

    if (!fileLink.trim()) {
      setError('Please enter a URL.');
      setIsLoading(false);
      return;
    }

    if (!isValidUrl(fileLink)) {
        setError('Invalid URL. Please enter a valid URL.');
        setIsLoading(false);
        return;
    }

    try {
      const finalQrUrl = await generateQrCodeWithLogo(fileLink, qrForegroundColor, customLogo);
      onQrGenerated(finalQrUrl, fileLink);
    } catch (err: any) {
        setError(`Failed to generate QR code: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveQrCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'alatar-qrcode-website.png'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-6">
      <form onSubmit={generateQrCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="website-url">Website URL</Label>
          <Input
            id="website-url"
            type="url"
            placeholder="https://example.com"
            value={fileLink}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFileLink(e.target.value);
                onQrGenerated('', '');
                setError('');
            }}
            required
            aria-label="Website URL Input"
            className="focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="qr-foreground-color-direct">QR Foreground Color (optional)</Label>
            <Input
                id="qr-foreground-color-direct"
                type="color"
                value={qrForegroundColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQrForegroundColor(e.target.value)}
                className="w-full h-10 p-1"
                aria-label="QR Code Foreground Color Picker"
            />
            </div>
            <div className="space-y-2">
                <Label htmlFor="logo-upload-website">Custom Logo (optional)</Label>
                <Input
                    id="logo-upload-website"
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/svg+xml"
                    onChange={handleLogoChange}
                    className="w-full text-sm file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-muted-foreground file:hover:bg-muted/80"
                    aria-label="Custom Logo Uploader"
                />
            </div>
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
              data-ai-hint="qr code logo" 
            />
          </div>
          <p className="text-xs text-muted-foreground break-all">
            URL: <a href={directLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{directLink}</a>
          </p>
        </div>
      )}
      {(qrCodeDataUrl || directLink) && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 mt-4 justify-center px-0">
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
                Open URL
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </div>
  );
}
