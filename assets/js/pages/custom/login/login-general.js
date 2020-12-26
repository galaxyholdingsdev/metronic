"use strict";

// Class Definition
var KTLogin = function () {
    var _login;

    var _showForm = function (form) {
        const cls = `login-${form}-on`;
        var form = `kt_login_${form}_form`;

        _login.removeClass("login-forgot-on");
        _login.removeClass("login-signin-on");
        _login.removeClass("login-signup-on");

        _login.addClass(cls);

        KTUtil.animateClass(KTUtil.getById(form), "animate__animated animate__backInUp");
    };

    function _getAuthFormSubmission(form, validation, btn)
    {
        return function(e)
        {
            e.preventDefault();
            const btn = this;

            validation.validate().then(function (status) {
                if (status === "Valid") {
                    KTUtil.btnWait(btn, "spinner spinner-right spinner-white pr-15", "Please wait");
                    fetch(form.action,
                        {
                            method: form.method,
                            body: new FormData(form)
                        })
                        .then(response => response.json())
                        .then(response =>
                        {
                            KTUtil.btnRelease(btn);
                            if (response.status === "success") {
                                _showMessage(response.message, "success", "Continue");
                                if (response.redirectUri) {
                                    window.location.assign(response.redirectUri);
                                }
                            }
                            else {
                                _showMessage(response.message, "error", "Try again");
                            }
                            console.log('Success:', response);
                        })
                        .catch(error =>
                        {
                            KTUtil.btnRelease(btn);
                            _showMessage(response.message, "error", "Try again");
                            console.error('Error:', error);
                        });
                }
                else {
                    _showMessage("Some errors were detected. Please check and try again", "error", "Ok, got it!");
                }
            });
        }
    }

    function _showMessage(text, icon, confirmText) {
        swal.fire({
            text: text,
            icon: icon,
            buttonsStyling: false,
            confirmButtonText: confirmText,
            customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
    }

    var _handleSignInForm = function () {
        var validation;
        var form = KTUtil.getById("kt_login_signin_form");
        if (!form) {
            return;
        }

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    username: {
                        validators: {
                            notEmpty: {
                                message: "Username is required"
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "Password is required"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $("#kt_login_signin_submit").on("click", _getAuthFormSubmission(form, validation));

        // Handle forgot button
        $("#kt_login_forgot").on("click",
            function (e) {
                e.preventDefault();
                _showForm("forgot");
            });

        // Handle signup
        $("#kt_login_signup").on("click",
            function (e) {
                e.preventDefault();
                _showForm("signup");
            });
    };

    var _handleChangePasswordForm = function () {
        var validation;
        var form = KTUtil.getById("kt_login_changepassword_form");
        if (!form) {
            return;
        }

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    oldPassword: {
                        validators: {
                            notEmpty: {
                                message: "The old password is required"
                            }
                        }
                    },
                    newPassword: {
                        validators: {
                            notEmpty: {
                                message: "The new password is required"
                            }
                        }
                    },
                    confirm: {
                        validators: {
                            notEmpty: {
                                message: "The password confirmation is required"
                            },
                            identical: {
                                compare: function () {
                                    return form.querySelector('[name="newPassword"]').value;
                                },
                                message: "The password and its confirm are not the same"
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $("#kt_login_changepassword_submit").on("click", _getAuthFormSubmission(form, validation));
    };

    var _handleSignUpForm = function (e) {
        var validation;
        var form = KTUtil.getById("kt_login_signup_form");
        if (!form)
        {
            return;
        }

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    fullname: {
                        validators: {
                            notEmpty: {
                                message: "Your full name is required"
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: "Email address is required"
                            },
                            emailAddress: {
                                message: "The value is not a valid email address"
                            }
                        }
                    },
                    username: {
                        validators: {
                            notEmpty: {
                                message: "Username is required"
                            }
                        }
                    },
                    phone: {
                        validators: {
                            notEmpty: {
                                message: "Phone number is required"
                            },
                            phone: {
                                message: "The value is not a valid phone number"
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "The password is required"
                            }
                        }
                    },
                    cpassword: {
                        validators: {
                            notEmpty: {
                                message: "The password confirmation is required"
                            },
                            identical: {
                                compare: function () {
                                    return form.querySelector('[name="password"]').value;
                                },
                                message: "The password and its confirm are not the same"
                            }
                        }
                    },
                    agree: {
                        validators: {
                            notEmpty: {
                                message: "You must accept the terms and conditions"
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $("#kt_login_signup_submit").on("click", _getAuthFormSubmission(form, validation));

        // Handle cancel button
        $("#kt_login_signup_cancel").on("click",
            function (e) {
                e.preventDefault();

                _showForm("signin");
            });
    };

    var _handleForgotForm = function (e) {
        var validation;
        var form = KTUtil.getById("kt_login_forgot_form");
        if (!form) {
            return;
        }

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: "Email address is required"
                            },
                            emailAddress: {
                                message: "The value is not a valid email address"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        // Handle submit button
        $("#kt_login_forgot_submit").on("click", _getAuthFormSubmission(form, validation));

        // Handle cancel button
        $("#kt_login_forgot_cancel").on("click",
            function (e) {
                e.preventDefault();

                _showForm("signin");
            });
    };

    // Public Functions
    return {
        // public functions
        init: function () {
            _login = $("#kt_login");

            _handleSignInForm();
            _handleSignUpForm();
            _handleForgotForm();
            _handleChangePasswordForm();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLogin.init();
});
