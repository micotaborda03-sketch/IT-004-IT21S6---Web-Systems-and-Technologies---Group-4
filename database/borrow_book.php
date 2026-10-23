<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

session_start(); // Start session to grab the user ID
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$book_id = $data['book_id'] ?? null;
$borrow_date = $data['borrow_date'] ?? '';
$return_date = $data['return_date'] ?? '';

if (!$book_id) {
    echo json_encode(["success" => false, "error" => "No book selected"]);
    exit;
}

// Get the user ID from the session. If not logged in, default to 1 for testing.
$user_id = $_SESSION['user_id'] ?? 1; 

// Insert the request WITH the user_id
$sql = "INSERT INTO borrow_requests (book_id, user_id, borrow_date, return_date, status) 
        VALUES ($book_id, $user_id, '$borrow_date', '$return_date', 'Pending')";

if (mysqli_query($conn, $sql)) {
    // Change book status to In Process
    $update_sql = "UPDATE books SET status='In Process' WHERE id=$book_id";
    mysqli_query($conn, $update_sql);

    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}
?>
