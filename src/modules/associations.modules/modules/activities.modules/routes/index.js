import adminRoutes from './admin'
import memberRoutes from './member'

import genericActivitiesUrls from '../modules/generics.modules/routes'
import eventsActivitiesUrls from '../modules/events.modules/routes'
import solidaritiesActivitiesUrls from '../modules/solidarities.modules/routes'
import tontinesActivitiesUrls from '../modules/tontines.modules/routes'
import mutualsActivitiesUrls from '../modules/mutuals.modules/routes'

export default [
  // Admin routes
  ...adminRoutes,

  // Member routes
  ...memberRoutes,

  // Generic activities routes
  ...genericActivitiesUrls,

  // Events activities routes
  ...eventsActivitiesUrls,

  // Solidarities activities routes
  ...solidaritiesActivitiesUrls,

  // Tontines activities routes
  ...tontinesActivitiesUrls,

  // Mutuals activities routes
  ...mutualsActivitiesUrls
]
