import bpiLogo from "../assets/bpi.png";
import gcashLogo from "../assets/gcash.jpg";
import ubLogo from "../assets/ub.jpg";
import bdoLogo from "../assets/bdo.png";
import maribankLogo from "../assets/maribank.jpeg";
import metrobankLogo from "../assets/metrobank.jpg";
import mayaLogo from "../assets/paymaya.png";
import wiseLogo from "../assets/wise.png";

export const setBankLogo = (bank) => {
  switch (String(bank ?? "").toLowerCase()) {
    case "bpi" :
      return bpiLogo
    case "bdo" :
      return bdoLogo
    case "gcash" :
      return gcashLogo
    case "maribank" :
      return maribankLogo
    case "metrobank" :
      return metrobankLogo
    case "maya" :
    case "paymaya" :
      return mayaLogo
    case "unionbank" :
      return ubLogo
    case "wise" :
      return wiseLogo
    default :
      return bdoLogo

  }
}