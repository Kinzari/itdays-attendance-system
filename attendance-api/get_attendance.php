<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get all attendance records for the current day
$query = "SELECT * FROM attendance WHERE DATE(check_in) = CURDATE()";
$result = mysqli_query($conn, $query);

$attendance_data = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $attendance_data[] = array(
            "student_id" => $row['student_id'],
            "first_name" => $row['first_name'],
            "middle_name" => $row['middle_name'],
            "family_name" => $row['family_name'],
            "suffix" => $row['suffix'],
            "year_level" => $row['year_level'],
            "tribu" => $row['tribu'],
            "in_time" => $row['check_in'],
            "out_time" => $row['check_out'],
            "status" => $row['status']
        );
    }
    echo json_encode($attendance_data);
} else {
    echo json_encode([]);
}

mysqli_close($conn);
?>
