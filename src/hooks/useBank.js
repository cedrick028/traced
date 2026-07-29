import { useContext } from "react";
import { BankContext } from "../context/bankContext";

export default function useBank() {
  return useContext(BankContext);
}