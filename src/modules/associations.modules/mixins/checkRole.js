export default {
  computed: {

    // Check if user is an administrator on an administration route
    isSuperAdministrator() {
      return this.$store.state.association.userRoles.includes('Administrateur')
        && this.$router.currentRoute.meta.rule !== 'editor'
        && this.$router.currentRoute.path.includes('/administration/')
    },

    // Check if user is a president on an administration route
    isPresident() {
      return this.$store.state.association.userRoles.includes('Président')
        && this.$router.currentRoute.meta.rule !== 'editor'
        && this.$router.currentRoute.path.includes('/administration');
    }
  },

  methods: {
    // Check if user has a role on an administration route
    hasRole(roleToCheck) {
      return this.$store.state.association.userRoles.includes(roleToCheck)
        || this.$store.state.association.userRoles.includes('Administrateur')
        && this.$router.currentRoute.meta.rule !== 'editor'
        && this.$router.currentRoute.path.includes('/administration/')
    },

    // Check if user has a list of roles on an administration route
    hasRoles(...rolesToCheck) {
      let found = true;
      let cpt = 0;

      while (cpt < rolesToCheck.length && found) {
        let roleToCheck = rolesToCheck[cpt]
        found = this.$store.state.association.userRoles.includes(roleToCheck)
      }

      return found
        || this.$store.state.association.userRoles.includes('Administrateur')
        && this.$router.currentRoute.meta.rule !== 'editor'
        && this.$router.currentRoute.path.includes('/administration/')
    },
  }
}
