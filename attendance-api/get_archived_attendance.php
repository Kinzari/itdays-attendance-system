<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

date_default_timezone_set('Asia/Manila');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the day parameter from the request
$day = isset($_GET['day']) ? intval($_GET['day']) : null;

if ($day !== null) {
    // Fetch the archived attendance data for the specified day
    $query = "SELECT * FROM attendance_archive WHERE day = '$day' ORDER BY family_name ASC";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $attendance = [];

        while ($row = $result->fetch_assoc()) {
            $attendance[] = [
                'student_id' => $row['student_id'],
                'first_name' => $row['first_name'],
                'middle_name' => $row['middle_name'],
                'family_name' => $row['family_name'],
                'suffix' => $row['suffix'],
                'year_level' => $row['year_level'],
                'tribu' => $row['tribu'],
                'in_time' => $row['check_in'],
                'out_time' => $row['check_out'],
                'status' => $row['status'],
                'day' => $row['day']
            ];
        }

        echo json_encode(['success' => true, 'attendance' => $attendance]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No attendance data found for Day ' . $day]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Day parameter is missing']);
}

$conn->close();
?>
