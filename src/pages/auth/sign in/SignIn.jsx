import { Lock, User } from "lucide-react";
import Logo from "../../../components/layout/logo/Logo";
import Input from "../../../components/UI/input/Input";
import Button from "../../../components/UI/button/Button";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const { signIn, isSignInLoading } = useAuth()
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" })
  const [authError, setAuthError] = useState("");
  const isFormIncomplete = !user.username.trim() || !user.password.trim();

  const handleSignin = async () => {
    if (isFormIncomplete || isSignInLoading) return;

    setAuthError("");
    const { data, error } = await signIn(user.username, user.password)

    if (error) {
      setAuthError("Incorrect credentials. Please check your username and password.");
      return;
    }

    if (data) {
      navigate("/dashboard")
    }
  }
  return (
    <div className="h-screen centerXY flex-col gap-10 px-6">
      <Logo />

      <div>
        <p className="font-bold text-3xl text-center tracking-wide">Welcome back!</p>
        <p className="text-center mt-2">Glad to see you again. Sign in to continue tracking your expenses</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <Input
          type="text"
          label="username"
          placeholder="enter your username"
          iconL={User}
          value={user.username}
          onChange={(e) => {
            setUser({ ...user, username: e.target.value });
            if (authError) setAuthError("");
          }}
        />
        <Input
          type="password"
          label="password"
          placeholder="enter your password"
          iconL={Lock}
          value={user.password}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            if (authError) setAuthError("");
          }}
        />
        {
          authError && (
            <p className="text-danger text-xs -mt-1">{authError}</p>
          )
        }
        <Button
          label={isSignInLoading ? "Signing in..." : "Sign In"}
          variant="primary"
          className="mt-1"
          onClick={handleSignin}
          loading={isSignInLoading}
          disabled={isFormIncomplete}
        />
      </div>

      <p className="text-muted">Don&apos;t have an account yet? <Link to="/signup" className="text-primary underline">Sign up</Link></p>
    </div>
  )
}