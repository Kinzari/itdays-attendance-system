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

$student_id = isset($data['student_id']) ? trim($data['student_id']) : null;
$password = isset($data['password']) ? trim($data['password']) : null;

if (empty($student_id) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit();
}

// Modified query to join year_levels and tribus tables
$stmt = $conn->prepare("
    SELECT students.student_id, students.first_name, students.middle_name, students.family_name, students.suffix, 
           students.phinmaed_email, students.contact_info, year_levels.level_name AS year_level_name, 
           tribus.name AS tribu_name, students.roles, students.password 
    FROM students 
    LEFT JOIN year_levels ON students.year_level = year_levels.id 
    LEFT JOIN tribus ON students.tribu_id = tribus.id 
    WHERE students.student_id = ?
");
$stmt->bind_param("s", $student_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($db_student_id, $first_name, $middle_name, $family_name, $suffix, $phinmaed_email, $contact_info, $year_level_name, $tribu_name, $roles, $hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'student_id' => $db_student_id,
                'first_name' => $first_name,
                'middle_name' => $middle_name,
                'family_name' => $family_name,
                'suffix' => $suffix,
                'contact_info' => $contact_info,
                'phinmaed_email' => $phinmaed_email,
                'year_level' => $year_level_name,  // Now contains the name instead of the ID
                'tribu' => $tribu_name,  // Now contains the name instead of the ID
                'roles' => $roles
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Student ID not found']);
}

$stmt->close();
$conn->close();
?>
