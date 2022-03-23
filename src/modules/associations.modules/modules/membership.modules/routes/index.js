import memberRoutes from './member'
import adminRoutes from './admin'

export default [
  // Member routes
  ...memberRoutes,

  // Administration routes
  ...adminRoutes
]
