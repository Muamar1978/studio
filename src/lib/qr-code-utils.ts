// src/lib/qr-code-utils.ts
import QRCode from 'qrcode';

export const generateQrCodeWithLogo = async (
  link: string,
  foregroundColor: string,
  logo: File | null
): Promise<string> => {
  const qrSize = 256;
  const backgroundColor = '#FFFFFF';

  const baseQrDataUrl = await QRCode.toDataURL(link, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: qrSize,
    margin: 1,
    color: {
      dark: foregroundColor,
      light: backgroundColor,
    },
  });

  const canvas = document.createElement('canvas');
  canvas.width = qrSize;
  canvas.height = qrSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context.');
  }

  return new Promise((resolve, reject) => {
    const qrImg = new window.Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

      const centerX = qrSize / 2;
      const centerY = qrSize / 2;
      const logoDiameterFactor = 0.3;
      const logoDiameter = qrSize * logoDiameterFactor;
      const logoRadius = logoDiameter / 2;
      const padding = 5;
      const clearRadius = logoRadius + padding;

      // Clear a circular area in the center for the logo
      ctx.beginPath();
      ctx.arc(centerX, centerY, clearRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = backgroundColor;
      ctx.fill();

      if (logo) {
        // Draw the uploaded logo
        const logoImg = new window.Image();
        logoImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI, false);
          ctx.clip();
          ctx.drawImage(logoImg, centerX - logoRadius, centerY - logoRadius, logoDiameter, logoDiameter);
          ctx.restore();
          resolve(canvas.toDataURL('image/png'));
        };
        logoImg.onerror = () => reject(new Error('Failed to load custom logo.'));
        logoImg.src = URL.createObjectURL(logo);
      } else {
        // Draw the default "NTU" logo
        const logoText = "NTU";
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white'; 
        ctx.fill();
        
        ctx.strokeStyle = '#333'; 
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const fontSizeFactor = 0.35; 
        const fontSize = logoDiameter * fontSizeFactor; 
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = foregroundColor; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(logoText, centerX, centerY);
        
        resolve(canvas.toDataURL('image/png'));
      }
    };
    qrImg.onerror = () => reject(new Error('Failed to load QR code image.'));
    qrImg.src = baseQrDataUrl;
  });
};
