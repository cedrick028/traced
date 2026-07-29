import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { TransactionProvider } from './context/TransactionContext.jsx'
import { BankProvider } from './context/bankContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <TransactionProvider>
      <BankProvider>
        <App />
      </BankProvider>
    </TransactionProvider>
  </AuthProvider>
)
