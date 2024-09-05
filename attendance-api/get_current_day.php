<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch the current day from the event_status table
$query = "SELECT current_day FROM event_status WHERE id = 1";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $current_day = intval($row['current_day']); // Ensure current_day is treated as an integer
    echo json_encode(["success" => true, "current_day" => $current_day]);
} else {
    echo json_encode(["success" => false, "message" => "No event status found."]);
}

$conn->close();
?>
