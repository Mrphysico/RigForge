import QRCode from 'qrcode';
import path from 'path';

const upiPayload = 'upi://pay?pa=9819319689@nyes&pn=Arth%20Rakesh%20Jadav&cu=INR&tn=RigForge%20Custom%20PC%20Order';
const targetPath = path.resolve('public/images/upi-qr.jpg');

QRCode.toFile(
  targetPath,
  upiPayload,
  {
    type: 'png',
    width: 600,
    margin: 2,
    color: {
      dark: '#09090b',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  },
  function (err) {
    if (err) {
      console.error('Failed to generate QR code:', err);
      process.exit(1);
    }
    console.log('Successfully generated UPI QR Code at:', targetPath);
  }
);
