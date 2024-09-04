'use client';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'react-qr-code'; // Ensure QRCode is imported correctly
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [qrData, setQrData] = useState('');
  const [studentName, setStudentName] = useState(''); // State to hold the student's name
  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('studentData');
    toast.success("Logging Out...");
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // 2-second delay before redirecting to the login page
  };

  useEffect(() => {
    const storedStudentData = localStorage.getItem('studentData');
    if (!storedStudentData) {
      window.location.href = '/login'; // Redirect if no student data is found
    } else {
      const studentInfo = JSON.parse(storedStudentData);
      setQrData(storedStudentData); // Use the student's data to generate QR content
      setStudentName(`${studentInfo.first_name} ${studentInfo.family_name}`);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Card className="w-full max-w-sm p-6 text-center bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">Welcome, {studentName}</CardTitle>
          <CardDescription className="mt-2">IT DAYS -  Attendance QR Code</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {qrData ? (
            <QRCode value={qrData} size={256} />
          ) : (
            <p>No QR data found. Please log in to generate your QR code.</p>
          )}
        </CardContent>
      </Card>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" className="mt-6">Log Out</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
