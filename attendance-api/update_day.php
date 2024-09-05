<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

$input = json_decode(file_get_contents("php://input"), true);
$new_day = isset($input['new_day']) ? intval($input['new_day']) : null;

if ($new_day === null) {
    echo json_encode(["success" => false, "message" => "Invalid input: new_day is missing."]);
    exit();
}

// Archive today's attendance data
$archive_query = "INSERT INTO attendance_archive (student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, check_out, status, day) 
                  SELECT student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, check_out, status, day
                  FROM attendance 
                  WHERE day = (SELECT MAX(day) FROM attendance)"; // Archive based on the current day

if ($conn->query($archive_query) === TRUE) {
    // Clear the attendance data for the archived day
    $delete_query = "DELETE FROM attendance WHERE day = (SELECT MAX(day) FROM attendance)";
    
    if ($conn->query($delete_query) === TRUE) {
        // Update the current day in the `event_status` table
        $update_day_query = "UPDATE event_status SET current_day = $new_day WHERE id = 1";
        if ($conn->query($update_day_query) === TRUE) {
            echo json_encode(["success" => true, "message" => "Attendance archived and day updated to " . $new_day]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update day: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to clear attendance: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Failed to archive attendance: " . $conn->error]);
}

$conn->close();
?>
