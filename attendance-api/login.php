<?php
// Allow CORS requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Important to allow cookies in CORS

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the input data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Sanitize input
$student_id = isset($data['student_id']) ? trim($data['student_id']) : null;
$password = isset($data['password']) ? trim($data['password']) : null;

if (empty($student_id) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit();
}

// Prepare and execute the SQL query
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

    // Verify password
    if (password_verify($password, $hashed_password)) {
        // Generate authToken
        $authToken = base64_encode(random_bytes(32));
    
        // Set the authToken as an HttpOnly cookie
        // Note: Secure should be true in production (HTTPS), false during localhost development
        setcookie('authToken', $authToken, time() + (86400 * 30), "/", "localhost", false, true); // For localhost development

        // Return success response with user data
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
                'year_level' => $year_level_name,
                'tribu' => $tribu_name,
                'roles' => $roles,
                'authToken' => $authToken // Include the token in the response (optional, for frontend if needed)
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
