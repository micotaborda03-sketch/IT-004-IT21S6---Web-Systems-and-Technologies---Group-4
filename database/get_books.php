<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include 'connection.php';

// We JOIN the books table with borrow_requests AND users
$sql = "SELECT b.*, 
               CONCAT(u.first_name, ' ', u.last_name) AS borrower_name 
        FROM books b 
        LEFT JOIN borrow_requests br ON b.id = br.book_id AND br.status = 'Approved'
        LEFT JOIN users u ON br.user_id = u.id";

$result = mysqli_query($conn, $sql);
$books = array();

while($row = mysqli_fetch_assoc($result)) {
    $books[] = $row;
}
echo json_encode($books);
?>
