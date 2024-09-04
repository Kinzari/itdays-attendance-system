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

$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Assign role properly
$role = isset($data['roles']) ? trim($data['roles']) : 'student';

$student_id = isset($data['student_id']) ? trim($data['student_id']) : null;
$password = isset($data['password']) ? trim($data['password']) : null;
$first_name = isset($data['first_name']) ? trim($data['first_name']) : null;
$middle_name = isset($data['middle_name']) ? trim($data['middle_name']) : null;
$family_name = isset($data['family_name']) ? trim($data['family_name']) : null;
$suffix = isset($data['suffix']) ? trim($data['suffix']) : null;
$contact_info = isset($data['contact_info']) ? trim($data['contact_info']) : null;
$phinmaed_email = isset($data['phinmaed_email']) ? trim($data['phinmaed_email']) : null;
$year_level = isset($data['year_level']) ? trim($data['year_level']) : null;
$tribu_id = isset($data['tribu_id']) ? trim($data['tribu_id']) : null;

if (empty($student_id) || empty($password) || empty($first_name) || empty($family_name) || empty($contact_info) || empty($phinmaed_email) || empty($year_level)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit();
}

// Check if student_id or phinmaed_email already exists
$stmt = $conn->prepare("SELECT COUNT(*) FROM students WHERE student_id = ? OR phinmaed_email = ?");
$stmt->bind_param("ss", $student_id, $phinmaed_email);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID or PHINMAED email already exists.']);
    exit();
}

// Insert new user
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO students (student_id, password, first_name, middle_name, family_name, suffix, contact_info, phinmaed_email, year_level, tribu_id, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssssis", $student_id, $hashed_password, $first_name, $middle_name, $family_name, $suffix, $contact_info, $phinmaed_email, $year_level, $tribu_id, $role);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Signup successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Signup failed']);
}

$stmt->close();
$conn->close();
?>
