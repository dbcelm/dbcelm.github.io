<?php
	if(isset($_POST['submit'])){
		$name=$_POST['name'];
		$email=$_POST['email'];
		$phone=$_POST['subject'];
		$msg=$_POST['msg'];

		$to='dbcelm@gmail.com'; // Receiver Email ID, Replace with your email ID
		$subject='Freelancing Query';
		$message="Name :".$name."\n"."Phone :".$phone."\n"."Wrote the following :"."\n\n".$msg;
		$headers="From: ".$email;

		if(mail($to, $subject, $message, $headers)){
                header("Location: https://dbcelm.com");
		}
		else{
			echo "Oops..!! Something went wrong!";
		}
	}
?>
