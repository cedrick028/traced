import Card from "../../components/layout/card/Card";
import BankSection from "../../components/layout/section/bank section/BankSection";
import SpentSection from "../../components/layout/section/spent section/SpentSection";
import TransactionSection from "../../components/layout/section/transaction section/TransactionSection";

export default function Dashboard() {
  return (
    <div className="p-4">
      <p className="text-lg font-bold tracking-wide">Dashboard</p>

      <Card />
      <SpentSection />
      <BankSection />
      <TransactionSection />
    </div>
  )
}