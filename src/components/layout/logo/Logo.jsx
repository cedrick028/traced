import appLogo from "../../../assets/logo.png";

export default function Logo() {
  return (
    <div className="centerX gap-2">
      <div className="w-5 h-5 centerXY">
        <img src={appLogo} className="w-full h-full" />
      </div>
      <p className="text-2xl font-bold tracking-wide">TRACED</p>
    </div>
  )
}