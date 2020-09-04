import React, { Component } from "react";
import {
  uploadImage,
  signupUser,
  signupUserBySocial,
  userLogin,
  adminForgotPassword,
  adminChangePassword,
} from "../../../actions";
import { connect } from "react-redux";
import Loader from "../../components/Reusable/LoaderSpinner";
import Dropzone from "../../components/Reusable/Dropzone";
import md5 from "crypto-js/md5";
import "./login.scss";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
let script =
  '<script src="/styles/js/custom.min.js"></script>' +
  '<script src="/styles/js/jquery.slimscroll.js"></script>' +
  // '<script src="/styles/js/validator.js"></script>' +
  '<script src="/plugins/bower_components/sidebar-nav/dist/sidebar-nav.min.js"></script>';

class Login extends Component {
  state = {
    isError: false,
    isSuccess: false,
    isErrorMessage: "",
    isSuccessMessage: "",

    showLoginForm: true,
    showSignupForm: false,
    showRecoverPasswordForm: false,
    showOtpForm: false,

    email: "",
    password: "",

    register_name: "",
    register_email: "",
    register_phone: "",
    register_address: "",
    register_password: "",
    register_cpassword: "",
    register_profile: "",
    register_profileData: "",

    recover_email: "",
    recover_otp: "",
    recover_password: "",
    recover_cpassword: "",

    formErrors: {
      loginEmail: false,
      email: false,
      password: false,
    },

    isLoading: false,
    invalidPassword: "Password should not contain white space.",
    invalidEmail: "Email format should be 'example@example.com'.",
  };

  componentDidMount = () => {
    if (localStorage.getItem("auth_Token") !== null) {
      this.props.history.push("/home");
    }
  };

  toggleForms = (type) => {
    this.setState({
      showLoginForm: type === "login" ? true : false,
      showSignupForm: type === "signup" ? true : false,
      showRecoverPasswordForm: type === "forgot" ? true : false,
      showOtpForm: type === "otp" ? true : false,
      isLoading: false,
      register_name: "",
      register_email: "",
      register_password: "",
      register_cpassword: "",
      register_profile: "",
      register_profileData: "",
      isError: false,
      isSuccess: false,
      isErrorMessage: "",
      isSuccessMessage: "",
    });
  };

  submitForm = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true }, () => {
      let { email, password } = this.state;
      let payload = {
        email: email,
        password: md5(password).toString(),
      };
      this.props
        .userLogin(payload)
        .then((res) => {
          if (res.responseData.status === 200) {
            this.props.history.push("/home");
          } else {
            this.setState({
              isError: true,
              isErrorMessage: "Email or password mismatch.",
              isLoading: false,
              isSuccess: false,
              isSuccessMessage: "",
            });
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  handleChange = (e) => {
    var element = e.target.name;
    let inputVal = e.target.value;
    let val = true;

    if (element === "email" || element === "loginEmail") {
      val = inputVal.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      val === null ? (val = false) : (val = true);
    } else if (element === "password") {
      val = !inputVal.match(/\s/g);
    }

    if (val) {
      this.setState({
        [element]: inputVal,
        formErrors: { ...this.state.formErrors, [element]: false },
      });
    } else {
      this.setState({
        [element]: inputVal,
        formErrors: { ...this.state.formErrors, [element]: true },
      });
    }
  };

  handelAddImage = (file) => {
    this.setState({
      register_profileData: file,
    });
  };

  handelRemoveImage = (file) => {
    this.setState({
      register_profileData: {},
    });
  };

  handelSignup = (e) => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
      },
      () => {
        if (this.state.register_profileData) {
          this.handelUploadProfile();
        } else {
          this.handelStoreAdmin();
        }
      }
    );
  };

  handelUploadProfile = () => {
    let { register_profileData } = this.state;
    var formData = new FormData();
    formData.append("type", "user");
    delete register_profileData.dataURL;
    delete register_profileData.previewElement;
    delete register_profileData.previewTemplate;
    delete register_profileData.upload;
    delete register_profileData.xhr;
    formData.append("display", register_profileData);

    this.props
      .uploadImage(formData)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.setState(
            {
              register_profile: res.responseData.url,
            },
            () => {
              this.handelStoreAdmin();
            }
          );
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handelStoreAdmin = () => {
    let {
      register_name,
      register_email,
      register_password,
      register_profile,
      register_phone,
      register_address,
    } = this.state;
    let payload = {
      name: register_name,
      email: register_email,
      password: md5(register_password).toString(),
      profile: register_profile,
      login_type: 0,
      phone: register_phone,
      address: register_address,
    };
    this.props
      .signupUser(payload)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.setState({
            isSuccessMessage: "Signup successfully.",
            isSuccess: true,
            isLoading: false,
            showSignupForm: false,
            showRecoverPasswordForm: false,
            showLoginForm: true,
          });
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            isErrorMessage: "Something went wrong.",
          });
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handelSendEmail = (e) => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
      },
      () => {
        let { recover_email } = this.state;
        this.props
          .adminForgotPassword({ email: recover_email })
          .then((res) => {
            if (res.responseData.status === 404) {
              this.setState({
                isError: true,
                isErrorMessage: "Email not exist.",
                isLoading: false,
              });
            } else if (res.responseData.status === 200) {
              this.setState(
                {
                  isError: false,
                  isErrorMessage: "",
                  isLoading: false,
                },
                () => {
                  this.toggleForms("otp");
                }
              );
            } else {
              this.setState({
                isError: true,
                isErrorMessage: "Email coul'd not send.",
                isLoading: false,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  };

  handelChangePassword = (e) => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
      },
      () => {
        let { recover_email, recover_otp, recover_password } = this.state;
        let payload = {
          email: recover_email,
          password: md5(recover_password).toString(),
          otp: parseInt(recover_otp),
        };
        this.props
          .adminChangePassword(payload)
          .then((res) => {
            if (res.responseData.status === 202) {
              this.setState({
                isLoading: false,
                isError: true,
                isErrorMessage: "OTP not matched.",
              });
            } else if (res.responseData.status === 200) {
              this.toggleForms("login");
              this.setState({
                isLoading: false,
                isSuccess: true,
                isSuccessMessage: "Password change successfully.",
              });
            } else {
              this.setState({
                isLoading: false,
                isError: true,
                isErrorMessage: "Something went wrong.",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  };
  handleFacebookLogin = (response) => {
    console.log("facebok", response);
    if (response) {
      this.handleSignUpBySocialMedia({
        sm_id: response.id,
        name: response.name ? response.name : "",
        email: response.email ? response.email : "",
        profile: response.picture ? response.picture.data.url : "",
        login_type: 2,
      });
    } else {
      console.log("Error in Facebook");
    }
  };
  handleGoogleLogin = (response) => {
    if (response && response.profileObj) {
      let data = response.profileObj;
      this.handleSignUpBySocialMedia({
        name: data.name ? data.name : "",
        email: data.email ? data.email : "",
        profile: data.imageUrl ? data.imageUrl : "",
        login_type: 2,
        sm_id: data.googleId ? data.googleId : "",
      });
    } else {
      console.log("Error in Google");
    }
  };
  handleGoogleLoginFail = (response) => {
    console.log("Error", response);
  };
  handleSignUpBySocialMedia = (payload) => {
    this.setState({ isLoading: true }, () => {
      this.props
        .signupUserBySocial(payload)
        .then((res) => {
          if (res.responseData.status === 201) {
            this.props.history.push("/home");
          } else {
            this.setState({
              isError: true,
              isErrorMessage: "Something went wrong.",
              isLoading: false,
              isSuccess: false,
              isSuccessMessage: "",
            });
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  render() {
    let {
      email,
      password,
      showLoginForm,
      showRecoverPasswordForm,
      formErrors,
      invalidEmail,
      invalidPassword,
      isLoading,
      showSignupForm,
      register_name,
      register_email,
      register_phone,
      register_address,
      register_password,
      register_cpassword,
      register_profile,
      register_profileData,
      signupMessage,
      showOtpForm,
      recover_email,
      recover_otp,
      recover_password,
      recover_cpassword,

      isError,
      isSuccess,
      isErrorMessage,
      isSuccessMessage,
    } = this.state;
    let disabled =
      !isLoading &&
      email !== "" &&
      password !== "" &&
      !formErrors.email &&
      !formErrors.password
        ? ""
        : "disabled";

    let disabledSignup = false;
    let disabledSendMail = recover_email ? false : true;

    return (
      <section id="wrapper" className="login-register">
        <div className={showSignupForm ? "login-box-2" : "login-box"}>
          <div className="white-box">
            {isError && (
              <div className="alert alert-danger">{isErrorMessage}</div>
            )}

            {isSuccess && (
              <div className="alert alert-success">{isSuccessMessage}</div>
            )}

            {showLoginForm && (
              <form className="form-horizontal" autoComplete="off">
                <h3 className="box-title m-b-10">Sign In</h3>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      required
                      placeholder="Email"
                      onChange={(e) => this.handleChange(e)}
                      name="email"
                      value={email}
                    />
                    {formErrors.email && (
                      <span className="text-danger">{invalidEmail}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-xs-12">
                    <label className="control-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      required
                      placeholder="Password"
                      onChange={(e) => this.handleChange(e)}
                      name="password"
                      value={password}
                    />
                    {formErrors.password && (
                      <span className="text-danger">{invalidPassword}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-md-12 d-flex justify-content-between">
                    <div
                      id="to-recover"
                      className="text-dark pull-right c-pointer"
                      onClick={() => {
                        this.toggleForms("signup");
                      }}
                    >
                      <i className="fa fa-user m-r-5" /> Signup?
                    </div>
                    <div
                      id="to-recover"
                      className="text-dark pull-right cursor-pointer"
                      onClick={() => {
                        this.toggleForms("forgot");
                      }}
                    >
                      <i className="fa fa-key m-r-5" /> Forgot password?
                    </div>
                  </div>
                </div>

                <div className="form-group text-center m-t-20">
                  <div className="col-xs-12">
                    <button
                      className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
                      type="submit"
                      onClick={this.submitForm}
                      disabled={disabled}
                    >
                      {isLoading ? (
                        <span className="d-flex align-items-center justify-content-center">
                          <Loader
                            width={18}
                            height={18}
                            borderWidth={2}
                            color="#bbb4b4"
                          />
                          &nbsp;Log In
                        </span>
                      ) : (
                        "Log In"
                      )}
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 m-t-10 text-center">
                    <div className="">
                      <FacebookLogin
                        appId="2745176722470414"
                        fields="name,email,picture"
                        callback={this.handleFacebookLogin}
                        cssClass="btn btn-facebook m-r-10"
                        icon="fa-facebook"
                        textButton=""
                      />
                      <GoogleLogin
                        clientId="390577471165-j7ief5f173sbitamed76f54rdm7ph8n6.apps.googleusercontent.com"
                        buttonText=""
                        onSuccess={this.handleGoogleLogin}
                        onFailure={this.handleGoogleLoginFail}
                        cookiePolicy={"single_host_origin"}
                        render={(renderProps) => (
                          <button
                            className="btn btn-googleplus"
                            onClick={(e) => {
                              e.preventDefault();
                              renderProps.onClick();
                            }}
                          >
                            <i
                              aria-hidden="true"
                              className="fa fa-google-plus"
                            />
                          </button>
                        )}
                        icon={false}
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {showSignupForm && (
              <form className="form-horizontal">
                <h3 className="box-title m-b-10">Sign Up</h3>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Name</label>
                    <input
                      className="form-control"
                      type="register_name"
                      placeholder="Name"
                      onChange={(e) => this.handleChange(e)}
                      name="register_name"
                      value={register_name}
                      autoComplete="register_name"
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Email</label>
                    <input
                      className="form-control"
                      type="register_email"
                      placeholder="Email"
                      onChange={(e) => this.handleChange(e)}
                      name="register_email"
                      value={register_email}
                      autoComplete="register_email"
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Phone</label>
                    <input
                      className="form-control"
                      type="register_phone"
                      placeholder="Phone"
                      onChange={(e) => this.handleChange(e)}
                      name="register_phone"
                      value={register_phone}
                      autoComplete="register_phone"
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Address</label>
                    <input
                      className="form-control"
                      type="register_address"
                      placeholder="Address"
                      onChange={(e) => this.handleChange(e)}
                      name="register_address"
                      value={register_address}
                      autoComplete="register_address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-xs-12">
                    <label className="control-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => this.handleChange(e)}
                      name="register_password"
                      value={register_password}
                      autoComplete="password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <label className="control-label">Confirm Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Confirm password"
                      onChange={(e) => this.handleChange(e)}
                      name="register_cpassword"
                      value={register_cpassword}
                      autoComplete="password"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <label className="control-label">Profile</label>
                    <Dropzone
                      handelAddImage={this.handelAddImage}
                      handelRemoveImage={this.handelRemoveImage}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-md-12 d-flex justify-content-between">
                    <div
                      id="to-recover"
                      className="text-dark pull-right cursor-pointer mt-2"
                      onClick={() => {
                        this.toggleForms("login");
                      }}
                    >
                      <i className="fa fa-sign-in m-r-5" /> Already have
                      account?
                    </div>
                  </div>
                </div>

                <div className="form-group text-center m-t-20">
                  <div className="col-xs-12">
                    <button
                      className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
                      type="submit"
                      onClick={this.handelSignup}
                      disabled={disabledSignup}
                    >
                      {isLoading ? (
                        <span className="d-flex align-items-center justify-content-center">
                          <Loader
                            width={18}
                            height={18}
                            borderWidth={2}
                            color="#bbb4b4"
                          />
                          &nbsp;Sign Up
                        </span>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {showRecoverPasswordForm && (
              <>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    this.toggleForms("login");
                  }}
                >
                  <i className="fa fa-arrow-left"></i> Back
                </span>
                <form className="form-horizontal">
                  <div className="">
                    <div className="">
                      <h3>Recover Password</h3>
                      <p className="text-muted">
                        Enter your Email and instructions will be sent to you!{" "}
                      </p>
                    </div>
                  </div>
                  <div className="form-group ">
                    <div className="col-xs-12">
                      <label className="control-label">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        name="recover_email"
                        value={recover_email}
                      />
                    </div>
                  </div>
                  <div className="form-group text-center m-t-20">
                    <div className="col-xs-12">
                      <button
                        className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
                        type="submit"
                        onClick={this.handelSendEmail}
                        disabled={disabledSendMail}
                      >
                        {isLoading ? (
                          <span className="d-flex align-items-center justify-content-center">
                            <Loader
                              width={18}
                              height={18}
                              borderWidth={2}
                              color="#bbb4b4"
                            />
                            &nbsp;Send
                          </span>
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {showOtpForm && (
              <form className="form-horizontal">
                <div className="">
                  <div className="">
                    <h3>Change Password</h3>
                    <p className="text-success">Check your email for OTP.</p>
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">OTP</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter OTP"
                      onChange={(e) => this.handleChange(e)}
                      name="recover_otp"
                      value={recover_otp}
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">New Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter password"
                      onChange={(e) => this.handleChange(e)}
                      name="recover_password"
                      value={recover_password}
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label className="control-label">Confirm Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter confirm password"
                      onChange={(e) => this.handleChange(e)}
                      name="recover_cpassword"
                      value={recover_cpassword}
                    />
                  </div>
                </div>
                <div className="form-group text-center m-t-20">
                  <div className="col-xs-12 d-flex justify-content-center">
                    <div className="col-xs-6 w-100">
                      <button
                        className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
                        type="submit"
                        onClick={this.handelChangePassword}
                      >
                        {isLoading ? (
                          <span className="d-flex align-items-center justify-content-center">
                            <Loader
                              width={18}
                              height={18}
                              borderWidth={2}
                              color="#bbb4b4"
                            />
                            &nbsp;Change
                          </span>
                        ) : (
                          "Change"
                        )}
                      </button>
                    </div>
                    <div className="col-xs-6 w-100">
                      <button
                        className="btn btn-danger btn-lg btn-block text-uppercase waves-effect waves-light"
                        type="button"
                        onClick={() => {
                          this.setState(
                            {
                              recover_email: "",
                            },
                            () => {
                              this.toggleForms("login");
                            }
                          );
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }
}
export default connect(null, {
  uploadImage,
  signupUser,
  signupUserBySocial,
  userLogin,
  adminForgotPassword,
  adminChangePassword,
})(Login);
