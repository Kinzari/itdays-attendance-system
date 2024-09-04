'use client';

import { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

export default function QRCodeScan() {
  const [qrData, setQrData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(true); // Manage camera activation state

  const handleScan = (data: any | null) => {
    if (data && data.text) {
      const parsedData = JSON.parse(data.text); // Parse the JSON string from the QR code
      setQrData(parsedData); // Store parsed data
      toast.success("QR Code scanned successfully!");
      setCameraActive(false); // Stop camera scanning after successful scan
    } else {
      setQrData(null);
    }
  };

  const handleError = (err: any) => {
    setError('Error accessing the camera.');
    console.error(err);
    toast.error('Failed to access camera.');
  };

  const resetScanner = () => {
    setQrData(null);
    setCameraActive(true); // Reactivate camera for scanning
  };

  useEffect(() => {
    const storedStudentData = localStorage.getItem('studentData');
    if (!storedStudentData) {
      window.location.href = '/login'; // Redirect if no student data is found
    } 
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ThemeToggle />
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-3xl md:text-3xl font-black text-center text-black">IT DAYS - Attendance QR Code Scanner</CardTitle>
          {/* <CardDescription className="text-center mt-2 text-gray-600">Scan student QR codes to retrieve data.</CardDescription> */}
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full mb-4">
            {cameraActive ? (
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
            ) : (
              <p className="text-green-600 font-bold">QR Code Captured Successfully</p>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {qrData ? (
            <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-300 text-black">NAME</th>
                  <th className="px-4 py-2 border border-gray-300 text-black">SCHOOL ID</th>
                  <th className="px-4 py-2 border border-gray-300 text-black">YEAR LEVEL</th>
                  <th className="px-4 py-2 border border-gray-300 text-black">TRIBU</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300 text-black">{`${qrData.first_name} ${qrData.family_name}`}</td>
                  <td className="px-4 py-2 border border-gray-300 text-black">{qrData.student_id}</td>
                  <td className="px-4 py-2 border border-gray-300 text-black">{qrData.year_level}</td>
                  <td className="px-4 py-2 border border-gray-300 text-black">{qrData.tribu}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Waiting for QR code...</p>
          )}
        </CardContent>
        <div className="text-center mt-6">
          <Button className="bg-black text-white" variant="outline" onClick={resetScanner}>Reset Scanner</Button>
        </div>
      </Card>
    </div>
  );
}
