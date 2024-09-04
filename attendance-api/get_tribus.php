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

$sql = "SELECT id, name FROM tribus";
$result = $conn->query($sql);

$tribus = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tribus[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($tribus);
?>
