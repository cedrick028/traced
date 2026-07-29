import bpiLogo from "../assets/bpi.png";
import gcashLogo from "../assets/gcash.jpg";
import ubLogo from "../assets/ub.jpg";
import bdoLogo from "../assets/bdo.png";

export const setBankLogo = (bank) => {
  switch (bank.toLowerCase()) {
    case "bpi" :
      return bpiLogo
    case "gcash" :
      return gcashLogo
    case "unionbank" :
      return ubLogo
    default :
      return bdoLogo

  }
}