<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

// Get the input JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Validate the input data
if (isset($data['student_id']) && isset($data['check_in'])) {
    $student_id = $data['student_id'];
    $check_in = date('H:i:s'); // Store only the time in the check_in
    $check_out = isset($data['check_out']) ? date('H:i:s') : null;

    // Check if the student has already checked in today
    $query = "SELECT * FROM attendance WHERE student_id = '$student_id' AND DATE(check_in) = CURDATE()";
    $result = mysqli_query($conn, $query);
    $attendance = mysqli_fetch_assoc($result);

    if (!$attendance) {
        // First scan, insert a new record with check_in
        $query = "INSERT INTO attendance (student_id, first_name, middle_name, family_name, suffix, year_level, tribu, check_in, status) 
                  VALUES (
                    '{$data['student_id']}', 
                    '{$data['first_name']}', 
                    '{$data['middle_name']}', 
                    '{$data['family_name']}', 
                    '{$data['suffix']}', 
                    '{$data['year_level']}', 
                    '{$data['tribu']}', 
                    '$check_in', 
                    'incomplete')";
    } else {
        // Check if check_out is already set
        if ($attendance['check_out'] === NULL) {
            // Second scan, update the record with check_out time
            $check_out = date('H:i:s');
            $query = "UPDATE attendance 
                      SET check_out = '$check_out', status = 'complete' 
                      WHERE student_id = '$student_id' AND DATE(check_in) = CURDATE()";
        } else {
            // Third scan or further, reject
            echo json_encode(["message" => "Scan reached its limit"]);
            exit;
        }
    }

    // Execute the query and handle the result
    if (mysqli_query($conn, $query)) {
        echo json_encode(["message" => "Attendance recorded successfully"]);
    } else {
        echo json_encode(["message" => "Failed to record attendance", "error" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["message" => "Invalid data"]);
}

// Close the connection
mysqli_close($conn);
?>
