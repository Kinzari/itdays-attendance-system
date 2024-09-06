'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type StudentRecord = {
    first_name: string;
    family_name: string;
    student_id: string;
    year_level: string;
    tribu: string;
    in_time: string | null;
    out_time: string | null;
    status: 'Complete' | 'Incomplete';
};

export default function InputForm() {
    const [studentID, setStudentID] = useState('');
    const [studentData, setStudentData] = useState<StudentRecord | null>(null);
    const [actionType, setActionType] = useState<'check_in' | 'check_out'>('check_in');

    const fetchStudentData = async (id: string) => {
        try {
            const response = await axios.post('http://localhost/attendance-api/get_student_data.php', {
                student_id: id  // Ensure this matches the expected input in PHP
            });

            if (response.data && response.data.success) {
                const student = response.data.student;
                setStudentData({
                    first_name: student.first_name || '',
                    family_name: student.family_name || '',
                    student_id: student.student_id || '',
                    year_level: student.year_level || '',
                    tribu: student.tribu || '',
                    in_time: student.check_in || '--',
                    out_time: student.check_out || '--',
                    status: student.status || 'Incomplete'
                });
                toast.success('Student data loaded');
            } else {
                toast.error(response.data.message || 'Student not found');
                setStudentData(null);
            }
        } catch (error) {
            toast.error('Error fetching student details');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (studentID === '') {
            toast.error('Please enter a valid STUDENT ID');
            return;
        }

        if (actionType === 'check_out' && studentData?.in_time === null) {
            toast.error('Check In First');
            return;
        }

        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // Get only the time in 24-hour format

        // Send data to /dashboard or save to database
        try {
            const response = await axios.post('http://localhost/attendance-api/submit_attendance.php', {
                student_id: studentData?.student_id,
                first_name: studentData?.first_name,
                family_name: studentData?.family_name,
                year_level: studentData?.year_level,
                tribu: studentData?.tribu,
                scan_mode: actionType,
                check_time: currentTime  // Only time
            });

            // Log the backend response for debugging
            console.log('Backend Response:', response.data);

            if (response.data.success) {
                if (actionType === 'check_in') {
                    setStudentData((prevData) => prevData && { ...prevData, in_time: response.data.check_time });
                } else {
                    setStudentData((prevData) => prevData && { ...prevData, out_time: response.data.check_time, status: 'Complete' });
                }
                toast.success(`Student ${actionType === 'check_in' ? 'Checked In' : 'Checked Out'} Successfully`);
            } else {
                toast.error(response.data.message || 'Failed to record attendance');
            }
        } catch (error) {
            console.error('Error while submitting attendance:', error);
            toast.error('Error while submitting attendance');
        }
    };



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40">
            <Card className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-3xl font-black text-center text-black">
                        IT DAYS - Attendance Input
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <form onSubmit={handleSubmit} className="w-full mb-4">
                        <Input
                            placeholder="Enter STUDENT ID"
                            value={studentID}
                            onChange={(e) => setStudentID(e.target.value)}
                            className="mb-4"
                        />
                        <Button type="button" onClick={() => fetchStudentData(studentID)} className="mb-4">
                            Load Student Data
                        </Button>

                        <div className="flex justify-between mb-4">
                            <Select value={actionType} onValueChange={(value) => setActionType(value as 'check_in' | 'check_out')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="check_in">Check In</SelectItem>
                                    <SelectItem value="check_out">Check Out</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="bg-black text-white">Submit</Button>
                        </div>
                    </form>

                    {/* Display student data */}
                    {studentData && (
                        <Table className="mt-4 w-full text-black">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NAME</TableHead>
                                    <TableHead>STUDENT ID</TableHead>
                                    <TableHead>YEAR LEVEL</TableHead>
                                    <TableHead>TRIBU</TableHead>
                                    <TableHead>IN</TableHead>
                                    <TableHead>OUT</TableHead>
                                    <TableHead>STATUS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{`${studentData.family_name}, ${studentData.first_name}`}</TableCell>
                                    <TableCell>{studentData.student_id}</TableCell>
                                    <TableCell>{studentData.year_level}</TableCell>
                                    <TableCell>{studentData.tribu}</TableCell>
                                    <TableCell>{studentData.in_time || '---'}</TableCell>
                                    <TableCell>{studentData.out_time || '---'}</TableCell>
                                    <TableCell>{studentData.status}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
