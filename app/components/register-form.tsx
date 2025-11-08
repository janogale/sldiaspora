"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schemas for each step
const step1Schema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(3, "Email must be at least 3 characters")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .max(100, "Last name must be less than 100 characters"),
  location: z.string().min(1, "Please enter a location"),
  title: z.string().max(100, "Title must be less than 100 characters"),
  expertise: z.string().max(100, "Expertise must be less than 100 characters"),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be less than 20 characters"),
  whatsapp: z
    .string()
    .min(7, "WhatsApp number must be at least 7 digits")
    .max(20, "WhatsApp number must be less than 20 characters"),
  city: z.string().max(100, "City must be less than 100 characters"),
});

// Combined schema for final submission
const completeFormSchema = step1Schema.merge(step2Schema);

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;
type CompleteFormData = z.infer<typeof completeFormSchema>;

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const totalSteps = 3;

  // Initialize form with React Hook Form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
    getValues,
  } = useForm<CompleteFormData>({
    resolver: zodResolver(completeFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      location: "",
      title: "",
      expertise: "",
      bio: "",
      phone: "",
      whatsapp: "",
      city: "",
    },
  });

  const validateStep1 = async (): Promise<boolean> => {
    const step1Fields: (keyof CompleteFormData)[] = [
      "email",
      "password",
      "confirmPassword",
    ];
    const isStep1Valid = await trigger(step1Fields);
    return isStep1Valid;
  };

  const validateStep2 = async (): Promise<boolean> => {
    const step2Fields: (keyof CompleteFormData)[] = [
      "first_name",
      "last_name",
      "location",
      "title",
      "expertise",
      "bio",
      "phone",
      "whatsapp",
      "city",
    ];
    const isStep2Valid = await trigger(step2Fields);
    return isStep2Valid;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep1();
      if (isValid) {
        // Submit registration after step 1 validation
        await handleRegistrationAndLogin();
      }
    } else if (currentStep === 2) {
      const isValid = await validateStep2();
      if (isValid) {
        setCurrentStep(3);
      }
    }
  };

  const handleRegistrationAndLogin = async () => {
    const data = getValues();
    console.log("=== Starting Registration Process ===");
    console.log("Form data:", { email: data.email, hasPassword: !!data.password });

    setIsSubmitting(true);
    setLoadingMessage("Creating your account...");

    const base = "https://sldp.duckdns.org";
    const registerUrl = `${base}/users/register`;
    const loginUrl = `${base}/auth/login`;

    console.log("Registration URL:", registerUrl);

    try {
      // Create user with axios
      console.log("Sending registration request...");
      console.log("Request payload:", { email: data.email, password: "***" });

      const createResp = await axios.post(
        registerUrl,
        {
          email: data.email,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✓ Registration successful!");
      console.log("Registration response status:", createResp.status);
      console.log("Registration response data:", createResp.data);

      // Small delay to ensure user is fully created in the database
      setLoadingMessage("Account created! Logging you in...");
      console.log("Waiting 1 second before login attempt...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Automatically log in the user after successful registration
      try {
        console.log("Sending login request...");
        console.log("Login URL:", loginUrl);
        console.log("Login payload:", { email: data.email, password: "***" });

        const loginResp = await axios.post(
          loginUrl,
          {
            email: data.email,
            password: data.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("✓ Login successful!");
        console.log("Login response status:", loginResp.status);
        console.log("Login response data:", loginResp.data);

        setLoadingMessage("Login successful!");

        // Extract and store access token
        const accessToken = loginResp.data?.access_token ||
                           loginResp.data?.["access-token"] ||
                           loginResp.data?.token ||
                           loginResp.data?.accessToken;

        if (accessToken) {
          console.log("Access Token:", accessToken);
          localStorage.setItem("access-token", accessToken);
          localStorage.setItem("authToken", accessToken);
          console.log("Access token saved to localStorage");
        } else {
          console.warn("No access token found in login response");
        }

        // Store the entire login response for debugging
        localStorage.setItem("loginResponse", JSON.stringify(loginResp.data));
        console.log("Full login response saved to localStorage");

        // Store user data if provided
        if (loginResp.data?.user) {
          localStorage.setItem("user", JSON.stringify(loginResp.data.user));
          console.log("User data:", loginResp.data.user);
          console.log("User data saved to localStorage");
        }
      } catch (loginError: any) {
        console.error("=== LOGIN FAILED (but registration succeeded) ===");
        console.error("Login error:", loginError);
        console.error("Login error response:", loginError?.response?.data);

        // Extract login error message
        let loginErrorMsg = "Login failed after registration";
        if (loginError?.response?.data?.errors) {
          loginErrorMsg = loginError.response.data.errors.map((e: any) => e.message).join(", ");
        } else if (loginError?.response?.data?.message) {
          loginErrorMsg = loginError.response.data.message;
        }

        alert(`Registration successful but automatic login failed:\n\n${loginErrorMsg}\n\nPlease try logging in manually with your credentials.`);
      }

      // Move to step 2 after successful registration
      setCurrentStep(2);
    } catch (error: any) {
      console.error("=== ERROR OCCURRED ===");
      console.error("Full error object:", error);
      console.error("Error response:", error?.response);
      console.error("Error response data:", error?.response?.data);
      console.error("Error response status:", error?.response?.status);
      console.error("Error response headers:", error?.response?.headers);
      console.error("Error message:", error?.message);

      let msg = "An unknown error occurred";

      if (error?.response?.data) {
        const errorData = error.response.data;

        // Check for GraphQL-style errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) =>
            err.message || err.error || JSON.stringify(err)
          ).join(", ");
          msg = errorMessages;
          console.error("GraphQL errors found:", errorData.errors);
        }
        // Check for standard error formats
        else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.error) {
          msg = errorData.error;
        } else if (errorData.detail) {
          msg = errorData.detail;
        } else {
          msg = JSON.stringify(errorData);
        }
      } else if (error?.message) {
        msg = error.message;
      } else {
        msg = String(error);
      }

      console.error("=== FINAL ERROR MESSAGE ===");
      console.error(msg);
      alert(`Registration/Login failed:\n\n${msg}`);
    } finally {
      console.log("=== Registration Process Ended ===");
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CompleteFormData) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);

    const base = "https://sldp.duckdns.org";
    const registerUrl = `${base}/users/register`;
    const updateFallback = `${base}/users/dc118cf0-0ff5-4c47-8b5c-b90f8bf2f8d0`;

    try {
      // Create user with axios
      const createResp = await axios.post(
        registerUrl,
        {
          email: data.email,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // const created = createResp.data;
      // const createdId =
      //   created?.id || created?.userId || created?.uuid || created?._id;
      // const updateUrl = createdId
      //   ? `${base}/users/${createdId}`
      //   : updateFallback;

      // // Update the created user (axios PUT)
      // const updateResp = await axios.put(
      //   updateUrl,
      //   {
      //     first_name: data.first_name,
      //     last_name: data.last_name,
      //     location: data.location,
      //     title: data.title,
      //     expertise: data.expertise,
      //     bio: data.bio,
      //     phone: data.phone,
      //     whatsapp: data.whatsapp,
      //     city: data.city,
      //   },
      //   { headers: { "Content-Type": "application/json" } }
      // );

      const updated = createResp.data;
      console.log("User created:", createResp, "updated:", updated);

      setSubmissionSuccess(true);
      setCurrentStep(3);
    } catch (error: any) {
      console.error("Registration failed:", error);
      const msg =
        error?.response?.data?.message || error?.message || String(error);
      alert(`Registration failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setCurrentStep(1);
  };

  const renderProgressBar = () => (
    <div className="progress mb-4" style={{ height: "8px" }}>
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        aria-valuenow={(currentStep / totalSteps) * 100}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center mb-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="d-flex align-items-center">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              step < currentStep
                ? "bg-success text-white"
                : step === currentStep
                ? "bg-primary text-white"
                : "bg-light text-muted"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            {step < currentStep ? <i className="fas fa-check"></i> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`flex-fill mx-2 ${
                step < currentStep ? "bg-success" : "bg-light"
              }`}
              style={{ height: "2px", minWidth: "50px" }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <section className="contact-us__area section pt-100 section-space-bottom overflow-hidden">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="contact-us__title-wrapper">
                <div className="section__title-wrapper mb-40">
                  <h6
                    className="section__title-wrapper-black-subtitle mb-10 wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                    Contact Information
                    <svg
                      width="14"
                      height="12"
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_3843_1169)">
                        <path
                          d="M4.92578 10.3748L6.49623 9.68052L5.62583 9.07031L4.92578 10.3748Z"
                          fill="#83CD20"
                        />
                        <path
                          d="M4.92578 10.3743L5.00073 8L13.9088 0L5.66505 9.1113L4.92578 10.3743Z"
                          fill="#83CD20"
                        />
                        <path d="M5 8L13.908 0L0 6.22704L5 8Z" fill="#83CD20" />
                        <path
                          d="M5.66406 9.1113L9.95686 12L13.9078 0L5.66406 9.1113Z"
                          fill="#034833"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3843_1169">
                          <rect width="13.908" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </h6>
                  <h2
                    className="section__title-wrapper-title wow fadeInLeft animated"
                    data-wow-delay=".3s"
                  >
                    Let Your Wanderlust Guide You
                  </h2>
                </div>

                <div className="contact-us__form-wrapper">
                  <div className="card-header py-4 text-white">
                    <h5 className="mb-0">Stage 1: Account Credentials</h5>
                  </div>
                  <div className="contact-us__form" id="contact-us__form">
                    <div className="row">
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Enter Email</span>
                          <input
                            id="email"
                            type="email"
                            placeholder="Your Email Address"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            {...register("email")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-envelope"></i>
                          </div>
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".5s"
                        >
                          <span>Enter Password</span>
                          <input
                            id="password"
                            type="password"
                            placeholder="Your Password"
                            className={`form-control ${
                              errors.password ? "is-invalid" : ""
                            }`}
                            {...register("password")}
                          />
                          <div className="icon icon-2">
                            <i className="fa-solid fa-asterisk"></i>
                          </div>
                          {errors.password && (
                            <div className="invalid-feedback">
                              {errors.password.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-12">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".6s"
                        >
                          <span>Confirm Password</span>
                          <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Your Password"
                            className={`form-control ${
                              errors.confirmPassword ? "is-invalid" : ""
                            }`}
                            {...register("confirmPassword")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-asterisk"></i>
                          </div>
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">
                              {errors.confirmPassword.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        {isSubmitting && loadingMessage && (
                          <div className="alert alert-info d-flex align-items-center mb-3">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <strong>{loadingMessage}</strong>
                          </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <button
                            type="button"
                            className="contact-btn mt-0 wow fadeInLeft animated"
                            data-wow-delay=".8s"
                            onClick={handleNext}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                Next{" "}
                                <i
                                  style={{ paddingLeft: "1rem" }}
                                  className="fas fa-arrow-right ms-1"
                                />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderStep2 = () => (
    <>
      <section className="contact-us__area section pt-100 section-space-bottom overflow-hidden">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="contact-us__title-wrapper">
                <div className="contact-us__form-wrapper">
                  <div className="card-header  text-white py-4">
                    <h5 className="mb-0">Stage 2: Account Details</h5>
                  </div>
                  <div className="contact-us__form" id="contact-us__form">
                    <div className="row">
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>First Name</span>
                          <input
                            id="firstName"
                            type="text"
                            placeholder="Enter First Name"
                            className={`form-control ${
                              errors.first_name ? "is-invalid" : ""
                            }`}
                            {...register("first_name")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          {errors.first_name && (
                            <div className="invalid-feedback">
                              {errors.first_name.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Last Name</span>
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Enter Last Name"
                            className={`form-control ${
                              errors.last_name ? "is-invalid" : ""
                            }`}
                            {...register("last_name")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          {errors.last_name && (
                            <div className="invalid-feedback">
                              {errors.last_name.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Phone </span>
                          <input
                            id="phone"
                            type="text"
                            placeholder="Enter Phone Number"
                            className={`form-control ${
                              errors.phone ? "is-invalid" : ""
                            }`}
                            {...register("phone")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-phone"></i>
                          </div>
                          {errors.phone && (
                            <div className="invalid-feedback">
                              {errors.phone.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>WhatsApp</span>
                          <input
                            id="whatsapp"
                            type="text"
                            placeholder="Enter WhatsApp Number"
                            className={`form-control ${
                              errors.whatsapp ? "is-invalid" : ""
                            }`}
                            {...register("whatsapp")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-message"></i>
                          </div>
                          {errors.whatsapp && (
                            <div className="invalid-feedback">
                              {errors.whatsapp.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Location</span>
                          <input
                            id="location"
                            type="text"
                            placeholder="Location"
                            className={`form-control ${
                              errors.location ? "is-invalid" : ""
                            }`}
                            {...register("location")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          {errors.location && (
                            <div className="invalid-feedback">
                              {errors.location.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>City</span>
                          <input
                            id="city"
                            type="text"
                            placeholder=" City"
                            className={`form-control ${
                              errors.city ? "is-invalid" : ""
                            }`}
                            {...register("city")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          {errors.city && (
                            <div className="invalid-feedback">
                              {errors.city.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Expertise</span>
                          <input
                            id="expertise"
                            type="text"
                            placeholder="Expertise"
                            className={`form-control ${
                              errors.expertise ? "is-invalid" : ""
                            }`}
                            {...register("expertise")}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          {errors.expertise && (
                            <div className="invalid-feedback">
                              {errors.expertise.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="col-12
                      "
                      >
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          {/* <span>Bio</span> */}
                          <textarea
                            id="Bio"
                            placeholder="Bio"
                            className={`form-control ${
                              errors.bio ? "is-invalid" : ""
                            }`}
                            {...register("bio")}
                          />

                          {errors.bio && (
                            <div className="invalid-feedback">
                              {errors.bio.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12  ">
                        <div className="d-flex gap-4 justify-content-between align-items-center mt-3">
                          <button
                            type="button"
                            className="contact-btn mt-0 wow fadeInLeft animated"
                            data-wow-delay=".8s"
                            onClick={handleBack}
                          >
                            <i
                              style={{ paddingRight: "1rem" }}
                              className="fas fa-arrow-left ms-1"
                            />{" "}
                            Back
                          </button>

                          <button
                            type="button"
                            className="contact-btn mt-0 wow fadeInLeft animated"
                            data-wow-delay=".8s"
                            onClick={handleNext}
                          >
                            Next{" "}
                            <i
                              style={{ paddingLeft: "1rem" }}
                              className="fas fa-arrow-right ms-1"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderStep3 = () => {
    const formData = getValues();
    return (
      <div className="d-flex justify-content-center">
        <div
          className="card border-0 shadow-lg"
          style={{ maxWidth: 900, width: "100%", overflow: "hidden" }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,#0f9d58,#83CD20)",
              padding: "2rem 1.25rem",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <i
                  className="fas fa-user-check text-success"
                  style={{ fontSize: "2.4rem" }}
                />
              </div>
              <div className="text-white">
                <h3 className="mb-1">Review & Submit</h3>
                <p className="mb-0 ">
                  Please review your details and complete registration.
                </p>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {!submissionSuccess ? (
              <div className="row">
                <div className="col-md-7">
                  <h5 className="mb-3">Registration Summary</h5>
                  <dl className="row">
                    <dt className="col-sm-4 text-muted">Email</dt>
                    <dd className="col-sm-8">{formData.email || "-"}</dd>

                    <dt className="col-sm-4 text-muted">First Name</dt>
                    <dd className="col-sm-8">{formData.first_name || "-"}</dd>

                    <dt className="col-sm-4 text-muted">Last Name</dt>
                    <dd className="col-sm-8">{formData.last_name || "-"}</dd>

                    <dt className="col-sm-4 text-muted">Title</dt>
                    <dd className="col-sm-8">{formData.title || "-"}</dd>

                    <dt className="col-sm-4 text-muted">Expertise</dt>
                    <dd className="col-sm-8">{formData.expertise || "-"}</dd>

                    <dt className="col-sm-4 text-muted">Location</dt>
                    <dd className="col-sm-8">{formData.location || "-"}</dd>

                    <dt className="col-sm-4 text-muted">City</dt>
                    <dd className="col-sm-8">{formData.city || "-"}</dd>

                    <dt className="col-sm-4 text-muted">Phone</dt>
                    <dd className="col-sm-8">{formData.phone || "-"}</dd>

                    <dt className="col-sm-4 text-muted">WhatsApp</dt>
                    <dd className="col-sm-8">{formData.whatsapp || "-"}</dd>
                  </dl>

                  {formData.bio && (
                    <>
                      <h6 className="mt-3">Bio</h6>
                      <p className="text-muted small">{formData.bio}</p>
                    </>
                  )}
                </div>

                <div className="col-md-5 d-flex flex-column justify-content-center align-items-center">
                  <div className="mb-3 text-center">
                    <span className="badge bg-warning text-dark py-2 px-3">
                      Ready to submit
                    </span>
                  </div>
                  <p className="text-muted text-center">
                    When you click Complete Registration we will create your
                    account then apply profile updates.
                  </p>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Complete Registration"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-12 text-center py-4">
                  <div className="mb-4">
                    <i
                      className="fas fa-check-circle text-success"
                      style={{ fontSize: "4rem" }}
                    />
                  </div>
                  <h3 className="text-success mb-3">Registration Complete!</h3>
                  <p className="lead mb-4">
                    Thank you for registering with the Somaliland Diaspora
                    Department.
                  </p>
                  <div className="mb-3">
                    <span className="badge bg-success py-2 px-3">Verified</span>
                  </div>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleReset}
                    >
                      Register Another Account
                    </button>
                    <a href="/" className="btn btn-outline-primary">
                      Go to Homepage
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          {renderStepIndicator()}
          {renderProgressBar()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit(onSubmit)}>{renderStep3()}</form>
          )}
        </div>
      </div>
    </div>
  );
}
