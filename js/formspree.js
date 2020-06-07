$(document).ready(function() {
  $('#contact-form').submit(function(e) {
    var name    = document.getElementById('name')
    var email   = document.getElementById('email')
    var phone   = document.getElementById('phone')
    var country = document.getElementById('country')
    var subject = document.getElementById('subject')
    var message = document.getElementById('message')

    if (!name.value || !email.value || !subject.value || !phone.value || !country.value || !message.<>value) {
      alertify.error("Please check your entries");
      return false;
    } else {
      $.ajax({
        method: 'POST',
        url: '//formspree.io/dbcelm@gmail.com',
        data: $('#contact-form').serialize(),
        datatype: 'json'
      });
      e.preventDefault();
      $(this).get(0).reset();
      alertify.success("Message sent");
    }
  });
});
