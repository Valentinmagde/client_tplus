
export default [
  {
    url: '/association/administration',
    name: "association:administration",
    slug: "home-admin",
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
        url: null,
        name: "Association",
        icon: "multiple-circle",
        i18n: "Association",
        submenu: [
          {
            url: '/association/administration/members',
            name: "association:administration/member",
            slug: "membre",
            i18n: "members",
          },
          {
            url: '/association/administration/cycles',
            name: "Cycle",
            slug: "cycle",
            i18n: "cycles",
          },
          /* {
            url: null,
            name: "Rapports",
            slug: "rapports",
            i18n: "reports",
          }, */
          {
            url: '/association/administration/documents',
            name: "Documents",
            slug: "document",
            i18n: "documents",
          },
          {
            url: '/association/administration/bills',
            name: "Billing",
            slug: "billing",
            i18n: "billing",
          },
          {
            url: '/association/administration/association-settings',
            slug: 'page-user-settings',
            name: "User Settings",
            icon: "SettingsIcon",
            i18n: "setting",
          }
        ],
      },
      {
        url: '/association/administration/activities',
        name: "Activities",
        slug: "page-activities-all",
        icon: "tool-box",
        i18n: "activities",
        /* submenu: [
          {
            url: '/association/administration/activity/create',
            name: "nouvelle-activite",
            slug: "nouvelle-activite",
            i18n: "newActivities",
          },
          {
            url: '/association/administration/activities',
            name: "page-activities-all",
            slug: "page-activities-all",
            i18n: "allActivities",
          },
        ], */
      },
      {
        url: null,
        name: "Finances",
        icon: "saving-bank-1",
        i18n: "finances",
        submenu: [
          {
            url: '/association/administration/finances/payment',
            slug: "save-a-payment",
            name: "save-a-payment",
            i18n: "saveAPayment",
          },
          {
            url: '/association/administration/finances/contribution',
            slug: "contribution",
            name: "contribution",
            i18n: "contributionRequest",
          },
          {
            url: '/association/administration/finances/withdrawal',
            slug: 'withdrawals',
            name: "withdrawals",
            i18n: "makeWithdrawals",
          },
          {
            url: '/association/administration/finances/overview',
            name: "situation_membre",
            slug: "situation_membre",
            icon: "CircleIcon",
            i18n: "membersSituation",
          },
          {
            url: '/association/administration/finances/treasury',
            slug: 'treasury',
            name: "treasury",
            i18n: "treasury",
          },
          {
            url: '/association/administration/finances/operations',
            slug: 'operation',
            name: "operation",
            i18n: "operations",
          }
        ],
      },

      {
        url: '/association/administration/sessions',
        name: 'association:home-admin',
        slug: "membre",
        icon: "multiple-users-wifi",
        i18n: "sessions",
      },
      /* {
        url: null,
        name: "content-moderation",
        slug: "content-moderation",
        icon: "filter-text",
        i18n: "contentModeration",
      }, */
     /*  {
        url: null,
        name: "outil",
        icon: "hammer-wench",
        i18n: "tools",
        submenu: [
          {
            url: null,
            name: "sondage",
            slug: "sondage",
            i18n: "survey",
          },
          {
            url: null,
            name: "referandum",
            slug: "referandum",
            i18n: "referendum",
          },
          {
            url: null,
            name: "election",
            slug: "election",
            i18n: "election",
          },
          {
            url: null,
            name: "site",
            slug: "site",
            i18n: "webSite",
          }
        ],
      }, */
    ]
  },
  {
    header: "Navigation",
    icon: "PackageIcon",
    i18n: "navigation",
    items: [
      {
        url: '/association/home',
        name: "retour",
        slug: "retour",
        icon: "single-man",
        i18n: "myAccount",
      },
      {
        url: '/associations',
        name: "mes-associations",
        slug: "mes-associations",
        icon: "multiple-circle",
        i18n: "myAssociations",
      }
    ]
  },
]

