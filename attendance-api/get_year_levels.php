<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');


// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "it_days_attendance";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, level_name FROM year_levels";
$result = $conn->query($sql);

$year_levels = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $year_levels[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($year_levels);
?>
