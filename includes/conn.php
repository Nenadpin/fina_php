<?php

  try {

  	$host = "sql110.epizy.com";
  	$dbname = "epiz_33138828_nenad";
  	$user = "epiz_33138828";
  	$pass = "zoe2ai9yTa";

  	$conn = new PDO ("mysql:host=$host;dbname=$dbname",$user,$pass);
  	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  } catch(PDOException $e) {

  	echo "error is: " . $e->getMessage();

  }
  ?>