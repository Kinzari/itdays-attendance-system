<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

date_default_timezone_set('Asia/Manila');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the current day from the event_status table
$current_day_result = $conn->query("SELECT current_day FROM event_status WHERE id = 1");
$current_day_row = $current_day_result->fetch_assoc();
$current_day = $current_day_row['current_day'];

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['student_id']) && isset($data['scan_mode'])) {
    $student_id = $data['student_id'];
    $scan_mode = $data['scan_mode'];
    $check_time = date('H:i:s');  // Only time format

    // Check if middle_name and suffix exist, else set to empty string
    $middle_name = isset($data['middle_name']) ? $data['middle_name'] : '';
    $suffix = isset($data['suffix']) ? $data['suffix'] : '';

    // Check if the student has already checked in today
    $query = "SELECT * FROM attendance WHERE student_id = '$student_id' AND day = '$current_day'";
    $result = mysqli_query($conn, $query);
    $attendance = mysqli_fetch_assoc($result);

    if (!$attendance && $scan_mode === 'check_in') {
        // First scan, insert check_in with the new day
        $query = "INSERT INTO attendance (student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, status, day) 
                  VALUES (
                    '{$data['student_id']}', 
                    '{$data['first_name']}', 
                    '$middle_name', 
                    '{$data['family_name']}', 
                    '$suffix', 
                    '{$data['year_level']}', 
                    '{$data['tribu']}', 
                    '$check_time', 
                    'Incomplete', 
                    '$current_day')";

        if (mysqli_query($conn, $query)) {
            echo json_encode([
                "success" => true,
                "message" => "Attendance recorded successfully",
                "check_time" => $check_time  // Return check_in time
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to record attendance",
                "error" => mysqli_error($conn)
            ]);
        }
    } elseif ($attendance && $scan_mode === 'check_out' && !$attendance['check_out']) {
        // Second scan, update with check_out
        $query = "UPDATE attendance 
                  SET check_out = '$check_time', status = 'Complete' 
                  WHERE student_id = '$student_id' AND day = '$current_day'";

        if (mysqli_query($conn, $query)) {
            echo json_encode([
                "success" => true,
                "message" => "Attendance recorded successfully",
                "check_time" => $check_time  // Return check_out time
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to record attendance",
                "error" => mysqli_error($conn)
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Scan reached its limit or invalid mode"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid data"
    ]);
}

mysqli_close($conn);
?>
