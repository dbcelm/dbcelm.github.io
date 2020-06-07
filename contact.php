<?php
	if(isset($_POST['submit'])){
		$name=$_POST['name'];
		$email=$_POST['email'];
		$subject=$_POST['subject'];
		$msg=$_POST['msg'];
		$phone=$_POST['phone'];
		$country=$_POST['country'];	

		$to='dbcelm@gmail.com'; // Receiver Email ID, Replace with your email ID
		$message="Name :".$name."\n"."Email :".$email."\n"."Phone :".$phone."\n"."Country :".$country."\n"."Wrote the following :"."\n\n".$msg;
		$headers="Subject: ".$subject;
		$headers="From: dbcelm@gmail.com";

		if(mail($to, $subject, $message, $headers)){
		
		header("Location: https://dbcelm.com");
		
		}
		else{
			echo "Oops..!! Something went wrong!";
		}
	}
?>
