# How to connect to the database properly

1. Place all PHP files in xampp/htdocs/library
2. Open XAMPP and start the servers (Apache and MySQL)
3. Go to phpMyAdmin and paste the following into the SQL query:

```sql
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS genres (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO genres (id, name) VALUES
('scifi', 'Sci-Fi & Cyberpunk'),
('fantasy', 'Fantasy & Supernatural'),
('action', 'Action, Adventure & Martial Arts'),
('romance', 'Romance & Drama'),
('mystery', 'Mystery, Horror & Psychological'),
('academics', 'Academics, Non-Fiction & Skill Building');

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    call_no VARCHAR(50) NOT NULL,
    genre_id VARCHAR(50) NOT NULL,
    borrower VARCHAR(100) DEFAULT '-',
    is_hidden BOOLEAN DEFAULT 0,
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS borrow_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```
