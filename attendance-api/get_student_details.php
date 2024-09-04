<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);
$qrData = isset($data['qrData']) ? trim($data['qrData']) : null;

if (!$qrData) {
    echo json_encode(['success' => false, 'message' => 'No QR data provided.']);
    exit();
}

// Assuming QR data contains the student ID or token
$stmt = $conn->prepare("SELECT student_id, first_name, family_name, year_level, tribu, check_in, status FROM students WHERE student_id = ?");
$stmt->bind_param("s", $qrData);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode($student);
} else {
    echo json_encode(['success' => false, 'message' => 'Student not found.']);
}

$stmt->close();
$conn->close();
?>
