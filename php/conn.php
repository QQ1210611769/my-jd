<?php

//1.设置字符编码
header('content-type:text/html;charset=utf-8');

//2.数据库连接
define('HOST', 'localhost'); 
define('USERNAME', 'root'); 
define('PASSWORD', '12345678'); 
define('DBNAME', 'nz1903'); 
$conn = @new mysqli(HOST, USERNAME, PASSWORD, DBNAME);
if ($conn->connect_error) {
    die('数据库连接错误，请检查用户名和密码！' . $conn->connect_error);
}