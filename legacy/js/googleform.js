function postToGoogle() {
        var field1 = $("#nameField").val();
        var field2 = $("#emailField").val();
        var field3 = $("#subjectField").val();

        if(field1 == ""){
          alert('Please Fill Your Name');
          document.getElementById("nameField").focus();
          return false;
        }
        if(field2 == ""){
          alert('Please Fill Your Email');
          document.getElementById("emailField").focus();
          return false;
        }
        if(field2 == ""){
          alert('Please Fill Subject');
          document.getElementById("subjectField").focus();
          return false;
        }




        $.ajax({
          url: "https://docs.google.com/forms/d/1k_1R-zSLtGVNOm4vi8BROY7QK1Hx0-y_tMimv4Iu9eA/formResponse?",
          data: {"entry.2005620554": field1, "entry.1045781291": field2, "entry.1166974658": field3, "entry.1065046570": field4},
          type: "POST",
          dataType: "xml",
          success: function(d)
          {
          },
          error: function(x, y, z)
            {

              alert('Thank you for your interest, I will be in touch soon');
              //$('#success-msg').show();
              //$('#form').hide();

            }
        });
        return false;
      }
