'use client';

import { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentRecord = {
  first_name: string;
  family_name: string;
  student_id: string;
  year_level: string;
  tribu: string;
  in_time: string | null;
  out_time: string | null;
  status: 'complete' | 'incomplete';
};

export default function QRCodeScan() {
  const [qrData, setQrData] = useState<StudentRecord | null>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const handleScan = async (data: any | null) => {
    if (data && data.text) {
      const parsedData = JSON.parse(data.text);

      try {
        // Make API call to submit attendance data
        const response = await axios.post('http://localhost/attendance-api/submit_attendance.php', {
          student_id: parsedData.student_id,
          first_name: parsedData.first_name,
          middle_name: parsedData.middle_name,
          family_name: parsedData.family_name,
          suffix: parsedData.suffix,
          year_level: parsedData.year_level,
          tribu: parsedData.tribu,
          check_in: new Date().toISOString(),  // You can adjust this based on the server
        });

        if (response.data.message === "Attendance recorded successfully") {
          setQrData({ ...parsedData, in_time: response.data.check_in, status: 'complete' });
          toast.success('QR Code scanned successfully!');
        } else if (response.data.message === "Scan reached its limit") {
          toast.error('Scan reached its limit.');
        } else {
          toast.error('Failed to record attendance');
        }
      } catch (error) {
        toast.error('An error occurred while recording attendance');
      }

      setCameraActive(false); // Stop camera after successful scan
    } else {
      setQrData(null);
    }
  };



  const resetScanner = () => {
    setQrData(null);
    setCameraActive(true); // Reactivate camera for scanning
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ThemeToggle />
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-3xl md:text-3xl font-black text-center text-black">
            IT DAYS - Attendance QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full mb-4">
            {cameraActive ? (
              <QrScanner
                delay={300}
                onError={(err) => toast.error('Failed to access camera.')}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
            ) : (
              <p className="text-green-600 font-bold">QR Code Captured Successfully</p>
            )}
          </div>
          <Button className="bg-black text-white" variant="outline" onClick={resetScanner}>
            Reset Scanner
          </Button>

          {/* Display QR data in a table if available */}
          {qrData && (
            <Table className="mt-4 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>STUDENT ID</TableHead>
                  <TableHead>SCHOOL YEAR</TableHead>
                  <TableHead>TRIBU</TableHead>
                  {/* <TableHead>IN</TableHead>
                  <TableHead>OUT</TableHead>
                  <TableHead>STATUS</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{`${qrData.family_name}, ${qrData.first_name.charAt(0)}.`}</TableCell>
                  <TableCell>{qrData.student_id}</TableCell>
                  <TableCell>{qrData.year_level}</TableCell>
                  <TableCell>{qrData.tribu}</TableCell>
                  {/* <TableCell>{qrData.in_time || '---'}</TableCell>
                  <TableCell>{qrData.out_time || '---'}</TableCell>
                  <TableCell>{qrData.status}</TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
