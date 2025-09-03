
"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import QRCode from 'qrcode';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { QrCode as QrCodeIcon, Download, Save, AlertCircle } from "lucide-react";
import Image from 'next/image';
import { CardFooter } from '@/components/ui/card';

interface GoogleDriveTabProps {
    onQrGenerated: (dataUrl: string, link: string) => void;
    qrCodeDataUrl: string;
    directLink: string;
}

export function GoogleDriveTab({ onQrGenerated, qrCodeDataUrl, directLink }: GoogleDriveTabProps) {
  const [gdriveLink, setGdriveLink] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrForegroundColor, setQrForegroundColor] = useState<string>('#000000');
  const qrBackgroundColor = '#FFFFFF'; // Fixed white background

  const generateDirectLink = (url: string): { link: string | null; error: string | null } => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      let fileId: string | null = null;
      let newDirectLink: string | null = null;
      
      // Regex for file/d/ and docs/document/d/ etc.
      const fileIdRegex = /\/d\/([a-zA-Z0-9_-]+)/;
      const match = url.match(fileIdRegex);
      if (match && match[1]) {
        fileId = match[1];
      } else {
        // Fallback for ?id= parameter
        const idParam = parsedUrl.searchParams.get('id');
        if (idParam) {
          fileId = idParam;
        }
      }

      if (!fileId) {
        return { link: null, error: 'Could not extract a valid File ID from the URL.' };
      }

      if (hostname === 'docs.google.com') {
        if (parsedUrl.pathname.startsWith('/document')) {
          newDirectLink = `https://docs.google.com/document/d/${fileId}/export?format=docx`;
        } else if (parsedUrl.pathname.startsWith('/spreadsheets')) {
          newDirectLink = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
        } else if (parsedUrl.pathname.startsWith('/presentation')) {
          newDirectLink = `https://docs.google.com/presentation/d/${fileId}/export?format=pptx`;
        }
      }

      // For standard drive.google.com links (for uploaded files like PDF, images, existing docx)
      if (hostname === 'drive.google.com' && parsedUrl.pathname.startsWith('/file')) {
        newDirectLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
      
      if (newDirectLink) {
        return { link: newDirectLink, error: null };
      }

      return { link: null, error: 'Unsupported Google Drive link format. Please use a valid shareable link from Google Drive, Docs, Sheets, or Slides.' };

    } catch (e) {
      return { link: null, error: 'Invalid URL provided.' };
    }
  };


  const generateQrCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    onQrGenerated('', '');

    if (!gdriveLink.trim()) {
      setError('Please enter a Google Drive link.');
      setIsLoading(false);
      return;
    }

    const { link: newDirectLink, error: linkError } = generateDirectLink(gdriveLink);

    if (linkError || !newDirectLink) {
      setError(linkError || 'Invalid Google Drive link or unable to extract file ID. Please use a valid shareable link.');
      setIsLoading(false);
      return;
    }

    try {
      const qrSize = 256;
      const baseQrDataUrl = await QRCode.toDataURL(newDirectLink, {
        errorCorrectionLevel: 'H', 
        type: 'image/png',
        width: qrSize,
        margin: 1, 
        color: {
          dark: qrForegroundColor, 
          light: qrBackgroundColor,
        }
      });

      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setError('Failed to get canvas context for adding logo.');
        setIsLoading(false);
        return;
      }

      const qrImg = new window.Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
        const logoText = "NTU"; 
        const logoVisualDiameterFactor = 0.25; 
        const logoVisualDiameter = qrSize * logoVisualDiameterFactor;
        const logoVisualRadius = logoVisualDiameter / 2;
        const paddingAroundLogoVisual = 6; 
        const totalClearRadius = logoVisualRadius + paddingAroundLogoVisual; 
        const centerX = qrSize / 2;
        const centerY = qrSize / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, totalClearRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white'; 
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoVisualRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white'; 
        ctx.fill();
        
        ctx.strokeStyle = '#333'; 
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const fontSizeFactor = 0.35; 
        const fontSize = logoVisualDiameter * fontSizeFactor; 
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = qrForegroundColor; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(logoText, centerX, centerY);
        
        const finalQrUrl = canvas.toDataURL('image/png');
        onQrGenerated(finalQrUrl, newDirectLink);
        setIsLoading(false);
      };
      qrImg.onerror = () => {
        setError('Failed to process QR image for logo. Please try again.');
        setIsLoading(false);
      };
      qrImg.src = baseQrDataUrl;

    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSaveQrCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'alatar-qrcode-gdrive-ntu.png'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-6">
      <form onSubmit={generateQrCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gdrive-link">Google Drive File Link</Label>
          <Input
            id="gdrive-link"
            type="url"
            placeholder="https://docs.google.com/document/d/..."
            value={gdriveLink}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setGdriveLink(e.target.value);
                onQrGenerated('', '');
                setError('');
            }}
            required
            aria-label="Google Drive File Link Input"
            className="focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-foreground-color-gdrive">QR Foreground Color</Label>
          <Input
            id="qr-foreground-color-gdrive"
            type="color"
            value={qrForegroundColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQrForegroundColor(e.target.value)}
            className="w-full h-10 p-1"
            aria-label="QR Code Foreground Color Picker"
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
              alt="Generated QR Code with NTU logo for Google Drive link" 
              width={256} 
              height={256} 
              className="rounded-md shadow-md border-2 border-primary p-1 bg-white"
              data-ai-hint="qr code logo" 
            />
          </div>
          <p className="text-xs text-muted-foreground break-all">
            Direct Link: <a href={directLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{directLink}</a>
          </p>
        </div>
      )}
      {(qrCodeDataUrl || directLink) && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 mt-4 justify-center px-0">
          {qrCodeDataUrl && (
            <Button variant="outline" onClick={handleSaveQrCode} className="w-full sm:w-auto">
            <Save className="mr-2 h-5 w-s5" />
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
    </div>
  );
}
