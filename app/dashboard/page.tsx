'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
  Filter,
  ArrowDownAZ,
  ArrowUpZA,
  ArrowDown01,
  ArrowUp10
} from "lucide-react";
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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

// Define the structure of the student data
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
  id: number;
  level_name: string;
};

type Tribu = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<StudentRecord[]>([]);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [tribus, setTribus] = useState<Tribu[]>([]);
  const [filteredData, setFilteredData] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('Display All');
  const [selectedTribu, setSelectedTribu] = useState('Display All');
  const [currentDay, setCurrentDay] = useState('Day 1'); // Default to 'Day 1'
  const [loading, setLoading] = useState(true);

  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [idSortOrder, setIdSortOrder] = useState<'asc' | 'desc' | null>(null);

  // State to manage visible columns
  const [visibleColumns, setVisibleColumns] = useState({
    student_name: true,
    student_id: true,
    year_level: true,
    tribu: true,
    in: true,
    out: true,
    status: true,
  });

  // Fetch the current day from the backend when the component mounts
useEffect(() => {
  const fetchCurrentDay = async () => {
    try {
      const response = await axios.get('http://localhost/attendance-api/get_current_day.php');
      if (response.data.success) {
        setCurrentDay(response.data.current_day);
      } else {
        console.error('Failed to fetch current day:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching current day:', error);
    }
  };

  fetchCurrentDay();
}, []);


  // Fetch attendance data, year levels, and tribus
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://localhost/attendance-api/get_attendance.php');
        setAttendanceData(response.data);
        setFilteredData(response.data); // Initially, show all data
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

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

    fetchAttendanceData();
    fetchYearLevels();
    fetchTribus();
  }, []);

  // Filter the attendance data based on selected filters and search query
  useEffect(() => {
    let filtered = attendanceData;

    if (selectedYearLevel !== 'Display All') {
      filtered = filtered.filter((student) => student.year_level === selectedYearLevel);
    }

    if (selectedTribu !== 'Display All') {
      filtered = filtered.filter((student) => student.tribu === selectedTribu);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [selectedYearLevel, selectedTribu, searchQuery, attendanceData]);

  // Sorting logic for student names
  const handleNameSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const nameA = `${a.family_name}, ${a.first_name}`.toLowerCase();
      const nameB = `${b.family_name}, ${b.first_name}`.toLowerCase();
      if (nameSortOrder === 'asc') {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    });
    setFilteredData(sortedData);
    setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Sorting logic for student IDs
  const handleIdSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (idSortOrder === 'asc') {
        return a.student_id.localeCompare(b.student_id, undefined, { numeric: true });
      } else {
        return b.student_id.localeCompare(a.student_id, undefined, { numeric: true });
      }
    });
    setFilteredData(sortedData);
    setIdSortOrder(idSortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle column visibility
  const handleColumnChange = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Handle Display All columns
  const handleDisplayAllChange = (checked: boolean) => {
    setVisibleColumns({
      student_name: checked,
      student_id: checked,
      year_level: checked,
      tribu: checked,
      in: checked,
      out: checked,
      status: checked,
    });
  };

  // End the current day and move to the next day
  const endDayEvent = async () => {
    if (currentDay !== null) {
      try {
        const newDay = currentDay + 1;  // Increment the day
        const response = await axios.post('http://localhost/attendance-api/update_day.php', { new_day: newDay });
        if (response.data.success) {
          setCurrentDay(newDay); // Update the state with the new day
          alert(`Day ${newDay} has started.`);
        } else {
          console.error('Error ending the day:', response.data.message);
          alert('Failed to end the day: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error ending the day:', error);
        alert('An error occurred while ending the day. Please try again.');
      }
    }
  };


  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state while fetching current day
  // }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Menu</TooltipContent>
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
                  {/* Add more navigation links here */}
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

              {/* Year Level DropdownMenu */}
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

              {/* Tribu DropdownMenu */}
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

              {/* Filter Dropdown Menu */}
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-5 w-5" />
                      Filter</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={Object.values(visibleColumns).every((val) => val)}
                          onCheckedChange={(checked) => handleDisplayAllChange(checked as boolean)}
                        />
                        <span>Display All</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.student_name}
                          onCheckedChange={() => handleColumnChange('student_name')}
                        />
                        <span>Student Name</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.student_id}
                          onCheckedChange={() => handleColumnChange('student_id')}
                        />
                        <span>Student ID</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.year_level}
                          onCheckedChange={() => handleColumnChange('year_level')}
                        />
                        <span>Year Level</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.tribu}
                          onCheckedChange={() => handleColumnChange('tribu')}
                        />
                        <span>Tribu</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.in}
                          onCheckedChange={() => handleColumnChange('in')}
                        />
                        <span>Checked In</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.out}
                          onCheckedChange={() => handleColumnChange('out')}
                        />
                        <span>Checked Out</span>
                      </label>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={visibleColumns.status}
                          onCheckedChange={() => handleColumnChange('status')}
                        />
                        <span>Status</span>
                      </label>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-black">Dashboard Day - {currentDay}</CardTitle>
                <CardDescription>
                  Below is the list of students scanned via QR Code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.student_name && (
                        <TableHead onClick={handleNameSort} className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>STUDENT NAME</span>
                            {nameSortOrder === 'asc' ? (
                              <ArrowDownAZ className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowUpZA className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.student_id && (
                        <TableHead onClick={handleIdSort} className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>STUDENT ID</span>
                            {idSortOrder === 'asc' ? (
                              <ArrowDown01 className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowUp10 className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.year_level && <TableHead>YEAR LEVEL</TableHead>}
                      {visibleColumns.tribu && <TableHead>TRIBU</TableHead>}
                      {visibleColumns.in && <TableHead>IN</TableHead>}
                      {visibleColumns.out && <TableHead>OUT</TableHead>}
                      {visibleColumns.status && <TableHead>STATUS</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((entry, index) => (
                        <TableRow key={index}>
                          {visibleColumns.student_name && (
                            <TableCell>{`${entry.family_name}, ${entry.first_name.charAt(0)}.`}</TableCell>
                          )}
                          {visibleColumns.student_id && <TableCell>{entry.student_id}</TableCell>}
                          {visibleColumns.year_level && <TableCell>{entry.year_level}</TableCell>}
                          {visibleColumns.tribu && <TableCell>{entry.tribu}</TableCell>}
                          {visibleColumns.in && <TableCell>{entry.in_time || '---'}</TableCell>}
                          {visibleColumns.out && <TableCell>{entry.out_time || '---'}</TableCell>}
                          {visibleColumns.status && <TableCell>{entry.status}</TableCell>}
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
                <div className="text-center mt-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-black text-white" variant="outline">
                        End Day Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        Confirm End Event?
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button className="bg-black text-white" onClick={endDayEvent}>
                            Confirm
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
