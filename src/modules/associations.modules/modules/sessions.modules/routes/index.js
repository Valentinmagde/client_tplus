import memberRoutes from './member'
import adminRoutes from './admin'

export default [
  // Admin routes
  ...adminRoutes,

  // Member routes
  ...memberRoutes,
]
