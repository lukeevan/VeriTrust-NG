import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, RefreshCw, Upload, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCode: (code: string, pin?: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectCode,
}) => {
  const { products } = useVerification();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [scratchPin, setScratchPin] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio beep on detection
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext may be restricted by browser policy
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setDetectedCode(null);
      setScratchPin('');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this device/browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCameraPermission(true);

      // Automated scan reader simulation (in a real browser without BarcodeDetector fallback)
      const timer = setTimeout(() => {
        // Auto-detect one of our certified sample products if scanning continues
        if (products.length > 0 && !detectedCode) {
          const sample = products[0];
          playBeep();
          setDetectedCode(sample.serialNumber);
          if (sample.scratchPin) {
            setScratchPin(sample.scratchPin);
          }
        }
      }, 3500);

      return () => clearTimeout(timer);
    } catch (err: any) {
      console.warn('Camera error or permission denied:', err);
      setHasCameraPermission(false);
      setCameraError(err.message || 'Camera permission was denied or device not found');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleSimulateScan = (serial: string, pin?: string) => {
    playBeep();
    setDetectedCode(serial);
    if (pin) setScratchPin(pin);
  };

  const handleConfirmVerification = () => {
    if (detectedCode) {
      onSelectCode(detectedCode, scratchPin.trim() || undefined);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file barcode read
      playBeep();
      const sample = products[Math.floor(Math.random() * products.length)];
      setDetectedCode(sample.serialNumber);
      if (sample.scratchPin) setScratchPin(sample.scratchPin);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Live Tag & Barcode Scanner</h2>
            <p className="text-xs text-slate-400">Position the QR code, GS1 DataMatrix, or barcode inside the frame</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black h-72 flex items-center justify-center overflow-hidden">
          {hasCameraPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Camera className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">Camera preview unavailable</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {cameraError || 'Use the manual simulator or upload a photo below'}
              </p>
            </div>
          )}

          {/* Laser Reticle & Scanline */}
          <div className="relative w-56 h-56 border-2 border-sky-400/80 rounded-2xl shadow-lg pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-sky-300" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-sky-300" />
            </div>
            {/* Animated Laser Bar */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scanline" />
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-sky-300" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-sky-300" />
            </div>
          </div>

          {/* Detected overlay badge */}
          {detectedCode && (
            <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 border border-emerald-500/50 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-emerald-400 font-medium">Tag Decoded Successfully</div>
                <div className="text-sm font-mono font-semibold text-white truncate">{detectedCode}</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls and Scratch PIN section */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {detectedCode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Scratch-Off Tamper PIN (Optional for luxury & pharma)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. 8492"
                  value={scratchPin}
                  onChange={e => setScratchPin(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Gently scratch the silver foil overlay on the tag to reveal the 4-digit verification code.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDetectedCode(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleConfirmVerification}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Authenticity</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Or select a test security tag:</span>
                <label className="cursor-pointer text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Tag Image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {products.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateScan(p.serialNumber, p.scratchPin)}
                    className="p-2.5 text-left bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
                  >
                    <div className="text-xs text-slate-400 truncate">{p.brand}</div>
                    <div className="text-sm font-mono font-medium text-slate-200 group-hover:text-sky-400 truncate">
                      {p.serialNumber}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
