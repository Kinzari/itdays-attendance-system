'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Home,
  PanelLeft,
  Search,
  Archive
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

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

type YearLevel = {
  level_name: string;
};

type Tribu = {
  name: string;
};

export default function Reports() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Select Day
  const [attendanceData, setAttendanceData] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<StudentRecord[]>([]);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [tribus, setTribus] = useState<Tribu[]>([]);
  const [selectedYearLevel, setSelectedYearLevel] = useState('Display All');
  const [selectedTribu, setSelectedTribu] = useState('Display All');

  // Fetch current day
  useEffect(() => {
    const fetchCurrentDay = async () => {
      try {
        const response = await axios.get('http://localhost/attendance-api/get_current_day.php');
        if (response.data.success) {
          setCurrentDay(response.data.current_day); // Set current day from the response
        } else {
          console.error('Failed to fetch current day:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching current day:', error);
      }
    };

    fetchCurrentDay();
  }, []);

  // Fetch year levels and tribus
  useEffect(() => {
    const fetchYearLevels = async () => {
      try {
        const response = await axios.get('http://localhost/attendance-api/get_year_levels.php');
        setYearLevels([{ level_name: 'Display All' }, ...response.data]);
      } catch (error) {
        console.error('Error fetching year levels:', error);
      }
    };

    const fetchTribus = async () => {
      try {
        const response = await axios.get('http://localhost/attendance-api/get_tribus.php');
        setTribus([{ name: 'Display All' }, ...response.data]);
      } catch (error) {
        console.error('Error fetching tribus:', error);
      }
    };

    fetchYearLevels();
    fetchTribus();
  }, []);

  // Fetch archived attendance based on the selected day
  useEffect(() => {
    const fetchArchivedAttendance = async () => {
      try {
        const day = selectedDay !== null ? selectedDay : currentDay; // Use selectedDay or currentDay if no selection
        if (day !== null) {
          const response = await axios.get(`http://localhost/attendance-api/get_archived_attendance.php?day=${day}`);
          if (response.data.success) {
            setAttendanceData(response.data.attendance);
            setFilteredData(response.data.attendance); // Set filteredData for search functionality
          } else {
            console.error('Failed to fetch archived data:', response.data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching archived data:', error);
      }
    };

    fetchArchivedAttendance();
  }, [selectedDay, currentDay]);

  // Filtering based on search query and dropdowns
  useEffect(() => {
    let filtered = attendanceData;

    if (selectedYearLevel !== 'Display All') {
      filtered = filtered.filter((student) => student.year_level === selectedYearLevel);
    }

    if (selectedTribu !== 'Display All') {
      filtered = filtered.filter((student) => student.tribu === selectedTribu);
    }

    filtered = filtered.filter(
      (student) =>
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredData(filtered);
  }, [searchQuery, selectedYearLevel, selectedTribu, attendanceData]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <TooltipProvider>
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <img
              src="/assets/cocicon.png"
              alt="Logo"
              className="h-10 w-10 mb-1"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">IT Days - Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">IT Days - Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/attendance-report"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Archive className="h-5 w-5" />
                  <span className="sr-only">IT Days - Reports</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">IT Days - Reports</TooltipContent>
            </Tooltip>
          </nav>
        </aside>

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/dashboard"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Home className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">IT Days - Dashboard</span>
                  </Link>
                  <Link
                    href="/attendance-report"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Archive className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">IT Days - Reports</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center justify-between w-full">
              {/* Search bar */}
              <div className="relative w-full max-w-xs md:max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-lg bg-background pl-8"
                />
              </div>

              {/* Day Selection Dropdown */}
              <div className="ml-4 flex items-center">
                <span className="mr-2">Select Day:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{selectedDay ? `Day ${selectedDay}` : `Day ${currentDay}`}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Array.from({ length: currentDay || 1 }, (_, i) => i + 1).map((day) => (
                      <DropdownMenuItem key={day} onClick={() => setSelectedDay(day)}>
                        Day {day}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Year Level Dropdown */}
              <div className="ml-4 flex items-center">
                <span className="mr-2">Year Level:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{selectedYearLevel}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {yearLevels.map((level, index) => (
                      <DropdownMenuItem key={index} onClick={() => setSelectedYearLevel(level.level_name)}>
                        {level.level_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tribu Dropdown */}
              <div className="ml-4 flex items-center">
                <span className="mr-2">Tribu:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{selectedTribu}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {tribus.map((tribu, index) => (
                      <DropdownMenuItem key={index} onClick={() => setSelectedTribu(tribu.name)}>
                        {tribu.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-black">Archived Attendance for Day {selectedDay || currentDay}</CardTitle>
                <CardDescription>
                  Below is the list of students for the selected day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STUDENT NAME</TableHead>
                      <TableHead>STUDENT ID</TableHead>
                      <TableHead>YEAR LEVEL</TableHead>
                      <TableHead>TRIBU</TableHead>
                      <TableHead>IN</TableHead>
                      <TableHead>OUT</TableHead>
                      <TableHead>STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${entry.family_name}, ${entry.first_name}`}</TableCell>
                          <TableCell>{entry.student_id}</TableCell>
                          <TableCell>{entry.year_level}</TableCell>
                          <TableCell>{entry.tribu}</TableCell>
                          <TableCell>{entry.in_time || '---'}</TableCell>
                          <TableCell>{entry.out_time || '---'}</TableCell>
                          <TableCell>{entry.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
