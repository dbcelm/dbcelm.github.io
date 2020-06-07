<?php
	if(isset($_POST['submit'])){
		$name=$_POST['name'];
		$email=$_POST['email'];
		$subject=$_POST['subject'];
		$msg=$_POST['msg'];
		$phone=$_POST['phone'];
		$country=$_POST['country'];	

		$to='dbcelm@gmail.com'; // Receiver Email ID, Replace with your email ID
		$message="Name :" .$name."\n"."Email :" .$email."\n"."Phone :" .$phone."\n"."Country :" .$country."\n"."Wrote the following :"."\n\n".$msg;
		$headers="Subject: ".$subject;
		$headers="From: dbcelm@gmail.com";

		if(mail($to, $subject, $message, $headers)){
		
		?>
    		<script language="javascript" type="text/javascript">
        	alert('Thank you for your interest, I have received your message and will contact back soon.');
        	window.location = 'index.html';
    		</script>
		<?php
		
		}
		else{
			
		?>
    		<script language="javascript" type="text/javascript">
        	alert('Oops, looks like there is some issue and you message is not delivered. Please send mail to dbcelm@gmail.com');
        	window.location = 'index.html';
    		</script>
		<?php
		}
	}
?>
