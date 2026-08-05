import appLogo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <button className="centerX gap-2" type="button" onClick={() => navigate("/dashboard")}>
      <div className="w-5 h-5 centerXY">
        <img src={appLogo} className="w-full h-full" />
      </div>
      <p className="text-2xl font-bold tracking-wide">TRACED</p>
    </button>
  )
}