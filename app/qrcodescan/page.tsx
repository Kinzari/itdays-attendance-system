'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

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
  const [scanMode, setScanMode] = useState<'check_in' | 'check_out'>('check_in'); // Toggle between Check IN and Check OUT
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  // Prevent rapid multiple scans
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);  // Ref for debounce timer

  const handleScan = async (data: any | null) => {
    if (data && data.text) {
      // Prevent multiple scans in rapid succession
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        const parsedData = JSON.parse(data.text);
        try {
          const response = await axios.post('http://localhost/attendance-api/submit_attendance.php', {
            student_id: parsedData.student_id,
            first_name: parsedData.first_name,
            middle_name: parsedData.middle_name,
            family_name: parsedData.family_name,
            suffix: parsedData.suffix,
            year_level: parsedData.year_level,
            tribu: parsedData.tribu,
            scan_mode: scanMode,
            check_time: new Date().toISOString(),
          });

          if (response.data.message === "Attendance recorded successfully") {
            setQrData({
              ...parsedData,
              in_time: scanMode === 'check_in' ? response.data.check_time : qrData?.in_time,
              out_time: scanMode === 'check_out' ? response.data.check_time : qrData?.out_time,
              status: scanMode === 'check_out' ? 'complete' : 'incomplete'
            });
            toast.success(`QR Code scanned successfully for ${scanMode === 'check_in' ? 'Check IN' : 'Check OUT'}`);
          } else if (response.data.message === "Scan reached its limit") {
            toast.error('Scan reached its limit.');
          } else {
            toast.error('Failed to record attendance');
          }
        } catch (error) {
          toast.error('An error occurred while recording attendance');
        }

        setCameraActive(false); // Stop camera after successful scan
      }, 200);  // Reduced debounce delay

    } else {
      setQrData(null);
    }
  };

  const resetScanner = () => {
    setQrData(null);
    setCameraActive(true); // Reactivate camera for scanning
  };

  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('studentData');
    toast.success("Logging Out...");
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // 2-second delay before redirecting to the login page
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ThemeToggle />
      <div className="absolute bottom-5 left-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Log Out</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-3xl md:text-3xl font-black text-center text-black">
            IT DAYS - Attendance QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full mb-4">
            <div className="flex justify-between mb-4">
              <Button
                variant={scanMode === 'check_in' ? 'default' : 'outline'}
                onClick={() => setScanMode('check_in')}
              >
                Check IN
              </Button>
              <Button
                variant={scanMode === 'check_out' ? 'default' : 'outline'}
                onClick={() => setScanMode('check_out')}
              >
                Check OUT
              </Button>
            </div>
            {cameraActive ? (
              <QrScanner
              delay={150}
              facingMode="environment" // Use the rear camera
              onError={(err: Error) => {
                console.error('Camera error:', err);
                toast.error('Failed to access camera.');
              }}
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
            <Table className="mt-4 w-full text-black">
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>STUDENT ID</TableHead>
                  <TableHead>SCHOOL YEAR</TableHead>
                  <TableHead>TRIBU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{`${qrData.family_name}, ${qrData.first_name.charAt(0)}.`}</TableCell>
                  <TableCell>{qrData.student_id}</TableCell>
                  <TableCell>{qrData.year_level}</TableCell>
                  <TableCell>{qrData.tribu}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
