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

// Get the input JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the 'day' parameter is provided
if (isset($data['day'])) {
    $day = intval($data['day']);  // Ensure day is treated as an integer
    
    // Debugging: check if the day is received correctly
    error_log("Received day: " . $day);
    
    if ($day === 0) {
        // Fetch current day from event_status table if it's not provided correctly
        $result = $conn->query("SELECT current_day FROM event_status WHERE id = 1");
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $day = intval($row['current_day']);
        }
        error_log("Fetched current day from event_status: " . $day);
    }

    // Archive query to move data from 'attendance' to 'attendance_archive'
    $archive_query = "INSERT INTO attendance_archive (student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, check_out, status, day)
                      SELECT student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, check_out, status, $day
                      FROM attendance
                      WHERE DATE(check_in) = CURDATE()";

    if ($conn->query($archive_query) === TRUE) {
        // Clear the attendance table for the current day
        $delete_query = "DELETE FROM attendance WHERE DATE(check_in) = CURDATE()";
        if ($conn->query($delete_query) === TRUE) {
            // Update the current day in the event_status table
            $update_day_query = "UPDATE event_status SET current_day = current_day + 1 WHERE id = 1";
            if ($conn->query($update_day_query) === TRUE) {
                echo json_encode(["success" => true, "message" => "Attendance archived and day updated to " . ($day + 1)]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to update event day: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to clear attendance data: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to archive attendance: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Day parameter is missing"]);
}

$conn->close();
?>
