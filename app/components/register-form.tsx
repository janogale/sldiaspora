"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

  attachment: z.string().optional(),
});

// Combined schema for final submission
const completeFormSchema = step1Schema.merge(step2Schema);

// type Step1FormData = z.infer<typeof step1Schema>;
// type Step2FormData = z.infer<typeof step2Schema>;
type CompleteFormData = z.infer<typeof completeFormSchema>;

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);

  const totalSteps = 2;

  // Initialize form with React Hook Form and Zod resolver
  const {
    register,
    formState: { errors },
    trigger,
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

      attachment: "",
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

      "attachment",
    ];
    const isStep2Valid = await trigger(step2Fields);
    return isStep2Valid;
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle attachment file upload
  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const validDocTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!validDocTypes.includes(file.type)) {
      alert("Please upload a valid document (PDF or image)");
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setAttachmentBase64(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      alert("Failed to process file. Please try again.");
    }
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
        // Update user profile after step 2 validation
        await handleUpdateProfile();
      }
    }
  };

  const handleUpdateProfile = async () => {
    setIsSubmitting(true);
    setLoadingMessage("Updating your profile...");

    try {
      // Get the access token from state first, then localStorage
      const token =
        accessToken ||
        localStorage.getItem("access-token") ||
        localStorage.getItem("authToken");

      console.log("Using access token:", token ? "Token found" : "No token");

      if (!token) {
        console.error("Token sources checked:");
        console.error("- State token:", accessToken);
        console.error(
          "- localStorage access-token:",
          localStorage.getItem("access-token")
        );
        console.error(
          "- localStorage authToken:",
          localStorage.getItem("authToken")
        );
        throw new Error("No access token found. Please try logging in again.");
      }

      // Update user profile
      // const updateResp = await axios.patch(
      //   updateUrl,
      //   {
      //     // access_token: token,
      //     first_name: data.first_name,
      //     last_name: data.last_name,
      //     location: data.location,
      //     title: data.title,
      //     expertise: data.expertise,
      //     bio: data.bio,
      //     phone: data.phone,
      //     whatsapp: data.whatsapp,
      //     city: data.city,

      //     attachment: attachmentBase64,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // console.log("Profile updated successfully:", updateResp.data);
      // setLoadingMessage("Profile updated!");

      // // Update stored user data
      // localStorage.setItem("user", JSON.stringify(updateResp.data));
      console.log(attachmentBase64);

      // Registration complete
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Profile update failed:" + error);
      // console.error("Profile update failed:", error?.response?.data || error);

      // let msg = "An unknown error occurred";

      // if (error?.response?.data) {
      //   const errorData = error.response.data;

      //   // Check for GraphQL-style errors
      //   if (errorData.errors && Array.isArray(errorData.errors)) {
      //     msg = errorData.errors
      //       .map((err: any) => err.message || err.error || JSON.stringify(err))
      //       .join(", ");
      //   }
      //   // Check for standard error formats
      //   else if (errorData.message) {
      //     msg = errorData.message;
      //   } else if (errorData.error) {
      //     msg = errorData.error;
      //   } else if (errorData.detail) {
      //     msg = errorData.detail;
      //   } else {
      //     msg = JSON.stringify(errorData);
      //   }
      // } else if (error?.message) {
      //   msg = error.message;
      // } else {
      //   msg = String(error);
      // }

      alert(`Profile update failed:\n\n`);
    } finally {
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  const handleRegistrationAndLogin = async () => {
    const data = getValues();

    setIsSubmitting(true);
    setLoadingMessage("Creating your account...");

    const base = "https://sldp.duckdns.org";
    const registerUrl = `${base}/users/register`;
    const loginUrl = `${base}/auth/login`;

    try {
      // Create user
      const createResp = await axios.post(
        registerUrl,
        {
          email: data.email,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Registration successful:", createResp.data);

      // Small delay to ensure user is fully created in the database
      setLoadingMessage("Account created! Logging you in...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Automatically log in the user after successful registration
      try {
        const loginResp = await axios.post(
          loginUrl,
          {
            email: data.email,
            password: data.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Login successful:", loginResp.data);
        setLoadingMessage("Login successful!");

        // Extract and store access token (check nested data object first)
        const responseData = loginResp.data?.data || loginResp.data;
        const token =
          responseData?.access_token ||
          responseData?.["access-token"] ||
          responseData?.token ||
          responseData?.accessToken;

        if (token) {
          console.log("Access token found and saved");
          localStorage.setItem("access-token", token);
          localStorage.setItem("authToken", token);
          setAccessToken(token); // Save to state for immediate use
        } else {
          console.warn("No access token found in response");
          console.warn("Response data:", loginResp.data);
          console.warn("Nested data:", responseData);
        }

        // Store the entire login response for debugging
        localStorage.setItem("loginResponse", JSON.stringify(loginResp.data));

        // Store user data if provided
        if (loginResp.data?.user) {
          localStorage.setItem("user", JSON.stringify(loginResp.data.user));
        }
      } catch (loginError) {
        // console.error(
        //   "Login failed (but registration succeeded):",
        //   loginError?.response?.data
        // )
        // Extract login error message
        // let loginErrorMsg = "Login failed after registration";
        // if (loginError?.response?.data?.errors) {
        //   loginErrorMsg = loginError.response.data.errors
        //     .map((e: any) => e.message)
        //     .join(", ");
        // } else if (loginError?.response?.data?.message) {
        //   loginErrorMsg = loginError.response.data.message;
        // }

        alert(
          `Registration successful but automatic login failed:\n\n${loginError}\n\nPlease try logging in manually with your credentials.`
        );
      }

      // Move to step 2 after successful registration
      setCurrentStep(2);
    } catch (error) {
      console.log(error);
      // console.error("Registration failed:", error?.response?.data || error);
      // let msg = "An unknown error occurred";
      // if (error?.response?.data) {
      //   const errorData = error.response.data;
      //   // Check for GraphQL-style errors
      //   if (errorData.errors && Array.isArray(errorData.errors)) {
      //     msg = errorData.errors
      //       .map((err: any) => err.message || err.error || JSON.stringify(err))
      //       .join(", ");
      //   }
      //   // Check for standard error formats
      //   else if (errorData.message) {
      //     msg = errorData.message;
      //   } else if (errorData.error) {
      //     msg = errorData.error;
      //   } else if (errorData.detail) {
      //     msg = errorData.detail;
      //   } else {
      //     msg = JSON.stringify(errorData);
      //   }
      // } else if (error?.message) {
      //   msg = error.message;
      // } else {
      //   msg = String(error);
      // }
      // alert(`Registration/Login failed:\n\n${msg}`);
    } finally {
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      {[1, 2].map((step) => (
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

                      {/* <div className="col-sm-12">
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
                      </div> */}

                      <div className="col-12">
                        {isSubmitting && loadingMessage && (
                          <div className="alert alert-info d-flex align-items-center mb-3">
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
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
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
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

                      <div className="col-sm-6">
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

                      <div className="col-12">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>
                            Document Attachment (Passport/National ID)
                          </span>
                          <input
                            id="attachment"
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/jpg"
                            className="form-control"
                            onChange={handleAttachmentChange}
                          />
                          <div className="icon">
                            <i className="fa-solid fa-file"></i>
                          </div>
                          {attachmentBase64 && (
                            <small className="text-success d-block mt-1">
                              <i className="fa-solid fa-check"></i> Document
                              uploaded successfully
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12  ">
                        {isSubmitting && loadingMessage && (
                          <div className="alert alert-info d-flex align-items-center mb-3">
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <strong>{loadingMessage}</strong>
                          </div>
                        )}
                        <div className="d-flex gap-4 justify-content-between align-items-center mt-3">
                          <button
                            type="button"
                            className="contact-btn mt-0 wow fadeInLeft animated"
                            data-wow-delay=".8s"
                            onClick={handleBack}
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
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

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          {!submissionSuccess && (
            <>
              {renderStepIndicator()}
              {renderProgressBar()}
            </>
          )}

          {currentStep === 1 && !submissionSuccess && renderStep1()}
          {currentStep === 2 && !submissionSuccess && renderStep2()}

          {submissionSuccess && (
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
                      <h3 className="mb-1">Registration Complete!</h3>
                      <p className="mb-0">
                        Your account has been successfully created.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-12 text-center py-4">
                      <div className="mb-4">
                        <i
                          className="fas fa-check-circle text-success"
                          style={{ fontSize: "4rem" }}
                        />
                      </div>
                      <h3 className="text-success mb-3">Success!</h3>
                      <p className="lead mb-4">
                        Thank you for registering with the Somaliland Diaspora
                        Department. Your profile has been created and updated
                        successfully.
                      </p>
                      <div className="mb-3">
                        <span className="badge bg-success py-2 px-3">
                          Verified
                        </span>
                      </div>
                      <div className="">
                        <Link href="/">
                          <button
                            type="button"
                            className="contact-btn mt-0 wow fadeInLeft animated"
                            data-wow-delay=".8s"
                            onClick={handleNext}
                            disabled={isSubmitting}
                          >
                            Back to Home
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
