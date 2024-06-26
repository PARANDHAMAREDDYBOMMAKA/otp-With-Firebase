/* eslint-disable no-unused-vars */
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { signInWithPhoneNumber, RecaptchaVerifier, createUserWithEmailAndPassword, sendEmailVerification, applyActionCode } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  function onSignup() {
    setLoading(true);

    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const formatPh = "+" + ph;

      signInWithPhoneNumber(auth, formatPh, recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setShowOTP(true);
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Failed to send OTP. Please try again.");
        });
    } catch (error) {
      setLoading(false);
      toast.error("Failed to initialize reCAPTCHA. Please try again.");
    }
  }

  function onOTPVerify() {
    setLoading(true);
    if (window.confirmationResult) {
      window.confirmationResult
        .confirm(otp)
        .then(async (res) => {
          setUser(res.user);
          setLoading(false);
          toast.success("Login successful!");
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Invalid OTP. Please try again.");
        });
    } else {
      setLoading(false);
      toast.error("An error occurred. Please try again.");
    }
  }

  const handleEmailSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword');
      await sendEmailVerification(userCredential.user);
      setLoading(false);
      toast.success('Verification email sent!');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleEmailVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const oobCode = urlParams.get('oobCode');

      if (mode === 'verifyEmail' && oobCode) {
        try {
          await applyActionCode(auth, oobCode);
          setEmailVerified(true);
          toast.success('Email verified successfully!');
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    handleEmailVerification();
  }, []);

  return (
    <section>
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user || emailVerified ? (
          <h2>👍 Login Success</h2>
        ) : (
          <div>
            {showOTP ? (
              <>
                <div>
                  <BsFillShieldLockFill size={30} />
                </div>
                <label htmlFor="otp">Enter your OTP</label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="otp-container"
                />
                <button onClick={onOTPVerify}>
                  {loading && <CgSpinner size={20} />}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <BsTelephoneFill size={30} />
                </div>
                <label htmlFor="">Verify your phone number</label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <button onClick={onSignup}>
                  {loading && <CgSpinner size={20} />}
                  <span>Send code via SMS</span>
                </button>
                <div>
                  <label htmlFor="email">Or sign up with email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <button onClick={handleEmailSignup}>
                    {loading && <CgSpinner size={20} />}
                    <span>Sign up with Email</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
