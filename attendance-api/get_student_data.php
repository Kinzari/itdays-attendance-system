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
$studentID = isset($data['student_id']) ? trim($data['student_id']) : null;

if (!$studentID) {
    echo json_encode(['success' => false, 'message' => 'No Student ID provided.']);
    exit();
}

// Perform the query to fetch the student details with JOINs
$sql = "SELECT 
            s.student_id,
            s.first_name,
            s.middle_name,
            s.family_name,
            s.suffix,
            yl.level_name AS year_level,
            t.name AS tribu
        FROM 
            students s
        JOIN 
            year_levels yl ON s.year_level = yl.id
        JOIN 
            tribus t ON s.tribu_id = t.id
        WHERE 
            s.student_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode(['success' => true, 'student' => $student]);
} else {
    echo json_encode(['success' => false, 'message' => 'Student not found.']);
}

$stmt->close();
$conn->close();
?>
