import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await signup(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleGoogleSignup = async () => {
  //   try {
  //     await loginWithGoogle();
  //     navigate("/", { replace: true });
  //   } catch (err) {
  //     console.error("Google signup failed:", err);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 space-y-6 bg-white shadow-lg rounded-xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up and start using the Invoicing App today.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // 👈 toggle type
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="pr-10" // add padding so icon doesn’t overlap text
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded-md">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? <Spinner size="sm" color="white" /> : "Sign Up"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-sm text-gray-400">or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Google Button */}
        {/* <Button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full justify-center bg-white border border-gray-300 text-black hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-black hover:text-white">
            Sign up with Google
          </span>
        </Button> */}

        {/* Switch to Login */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
