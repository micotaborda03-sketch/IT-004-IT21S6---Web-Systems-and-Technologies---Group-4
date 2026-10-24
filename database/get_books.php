<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include 'connection.php';

$sql = "SELECT * FROM books";
$result = mysqli_query($conn, $sql);
$books = array();

while($row = mysqli_fetch_assoc($result)) {
    $books[] = $row;
}
echo json_encode($books);
?>
