import debtRoutes from './routes/debt.routes'
import contactRoutes from './routes/contact.routes'

const routes = [
  { path: '/debts', router: debtRoutes },
  { path: '/contacts', router: contactRoutes }
];

export default routes;