import { Lock, User } from "lucide-react";
import { Link } from "react-router-dom"
import Logo from "../../../components/layout/logo/Logo";
import Input from "../../../components/UI/input/Input";
import Button from "../../../components/UI/button/Button";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

export default function SignUp() {
  const [newUser, setNewUser] = useState({ displayName: "", username: "", password: "", rePassword: "" })
  const { signUp, isSignUpLoading } = useAuth();
  const isFormIncomplete = Object.values(newUser).some((value) => !value.trim());
  const isPasswordMismatch = newUser.password !== newUser.rePassword;
  const isSignUpDisabled = isFormIncomplete || isPasswordMismatch;

  const handleSignUp = async () => {
    if (isSignUpDisabled) return;

    try {
      const data = await signUp(newUser.displayName, newUser.username, newUser.password)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen centerXY flex-col gap-6 px-6">
      <Logo />

      <div>
        <p className="font-medium text-3xl text-center tracking-wide">Create your account</p>
        <p className="text-center mt-2">Sign up to start tracking your expenses and take control of your finances.</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Input type="text" placeholder="enter your name" iconL={User} value={newUser.displayName} onChange={(e) => setNewUser({...newUser, displayName: e.target.value})} />
        <Input type="text" placeholder="enter your username" iconL={User} value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
        <Input type="password" placeholder="enter your password" iconL={Lock} value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
        <Input type="password" placeholder="re-type your password" iconL={Lock} value={newUser.rePassword} onChange={(e) => setNewUser({...newUser, rePassword: e.target.value})} />
        <Button label={isSignUpLoading ? "Signing up..." : "Sign Up"} variant="primary" className="mt-2" onClick={handleSignUp} disabled={isSignUpDisabled} />
      </div>
      <p className="text-muted">Already have an account? <Link to="/" className="text-primary underline">Sign in</Link></p>
    </div>
  )
}