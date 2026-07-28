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

  const handleSignin = async () => {
    const data = await signIn(user.username, user.password)

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
        <Input type="text" label="username" placeholder="enter your username" iconL={User} value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} />
        <Input type="password" label="password" placeholder="enter your password" iconL={Lock} value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} />
        <Button label={isSignInLoading ? "Signing in..." : "Sign In"} variant="primary" className="mt-1" onClick={handleSignin} />
      </div>

      <p className="text-muted">Don&apos;t have an account yet? <Link to="/signup" className="text-primary underline">Sign up</Link></p>
    </div>
  )
}