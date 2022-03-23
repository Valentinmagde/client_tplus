
export default [
  {
    url: '/association/home',
    name: "home-association",
    slug: "home",
    tagColor: "warning",
    icon: "house-1",
    i18n: "home",
  },
  {
    header: "Apps",
    icon: "PackageIcon",
    i18n: "Apps",
    items: [
      {
        url: '/association/members',
        name: "Members",
        slug: "app-member-account",
        icon: "multiple-users-1",
        i18n: "members",
      },
      {
        url: '/association/news',
        name: "Nouvelle",
        slug: "app-nouvelle",
        icon: "newspaper-fold",
        tagColor: "success",
        i18n: "news",
      },
      {
        url: '/association/finances',
        slug: 'page-finances',
        name: "page-finances",
        icon: "saving-bank-1",
        i18n: "finances",
      },
      {
        url: "/association/calendar",
        name: "app-calendar",
        slug: "app-calendar",
        icon: "calendar-3",
        tagColor: "success",
        i18n: "Calendar",
      },
      {
        url: "/association/activities/my-activities",
        name: "Activities",
        slug: "activite",
        icon: "tool-box",
        i18n: "activities",
        /* submenu: [
          {
            url: "/apps/activities/all-activities/member",
            name: "mes-activites",
            slug: "mes-activites",
            icon: "CircleIcon",
            i18n: "myActivities",
          },
          {
            url: null,
            name: "globale",
            slug: "globale",
            icon: "CircleIcon",
            i18n: "overview",
          }
        ], */
      },
      {
        url: "/association/documents",
        slug: "documents",
        name: "Documents",
        icon: "folder-file",
        i18n: "documents",
      },
      {
        url: "/association/sessions",
        slug: 'sessions',
        name: "sessions",
        icon: "multiple-users-wifi",
        i18n: "sessions",
      }
    ]
  },
  {
    header: "Navigation",
    icon: "PackageIcon",
    i18n: "navigation",
    items: []
  },
]

