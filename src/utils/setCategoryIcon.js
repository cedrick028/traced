import { ArrowDownCircle, ArrowUpCircle, Box, Car, Droplets, ShoppingBag, ShoppingCart, TicketIcon, TvMinimalPlayIcon } from "lucide-react"

export const setCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "grocery" :
      return ShoppingCart
    case "shopping" :
      return ShoppingBag
    case "utilities" :
      return Droplets
    case "transportation" :
      return Car
    case "subscriptions" :
      return TvMinimalPlayIcon
    case "entertainment" :
      return TicketIcon
    case "income" :
      return ArrowUpCircle
    case "expense" :
      return ArrowDownCircle
    default :
      return Box
  }
}