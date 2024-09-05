'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/attendance-api/login.php', {
        student_id: studentID,
        password: password,
      });

      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('studentData', JSON.stringify(userData)); // Save student data in local storage

        if (userData.roles === 'admin') {
          toast.success("Successfully Logged In as ADMIN.");
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
        else if (userData.roles === 'sbo') {
          toast.success("Successfully Logged In as SBO.");
          setTimeout(() => {
            window.location.href = '/qrcodescan';
          }, 2000);
        } else {
          toast.success("Successfully Logged In.");
          setTimeout(() => {
            window.location.href = '/attendance';
          }, 2000);
        }
      }
      else {
        toast.error("Login Failed. Incorrect Student ID or Password");
      }
    } catch (error) {
      toast.error("Login Failed");
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center">
            <Image
              src="/assets/cocicon.png"
              alt="Sign Up Icon"
              width={48}
              height={48}
              className="mr-3"
            />
            <CardTitle className="text-3xl font-black">IT DAYS - Login</CardTitle>
          </div>
          <CardDescription>
            Enter your Student ID to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="studentID">Student ID</Label>
              <Input
                id="studentID"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                placeholder="02-2425-12345"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline font-bold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
