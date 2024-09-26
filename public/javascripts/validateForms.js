if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    (function () {
      "use strict";
  
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll(".validate_form");
  
      // Loop over them and prevent submission
      Array.from(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }
  
            // Update validation styles
            var elements = form.elements;
            for (var i = 0; i < elements.length; i++) {
              var element = elements[i];
              if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                if (element.checkValidity()) {
                  element.classList.add("is-valid");
                  element.classList.remove("is-invalid");
                } else {
                  element.classList.add("is-invalid");
                  element.classList.remove("is-valid");
                }
              }
            }
  
            form.classList.add("was-validated");
          },
          false
        );
      });
    })();
  }