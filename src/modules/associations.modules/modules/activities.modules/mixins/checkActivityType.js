export default {
  methods: {

    // Based on the retrieved activity and the route path
    // Test type and redirect to activities list if failure
    //
    // Testing unit
    /* Navigate towards activities pages without using buttons */
    // Oracle: True on the 28/11/2020
    checkActivityType(activity) {
      let routeType
      let routePath = this.$router.currentRoute.path
      let activity_id = localStorage.getItem('activity_id')

      if(routePath.includes('/generic/')) routeType = (activity.type === 'caisse') ? 'caisse' : 'Generique'
      else if(routePath.includes('/tontine')) routeType = 'Tontine'
      else if(routePath.includes('/solidarity')) routeType = 'Solidarite'
      else if(routePath.includes('/mutual')) routeType = 'Mutuelle'
      else if(routePath.includes('/event')) routeType = 'Evenement'

      if(activity.type !== routeType || activity_id ===  undefined) {
        if(this.$router.currentRoute.meta.rule != 'editor')
          this.$router.push('/association/administration/activities')
        else
          this.$router.push('/association/activities/my-activities')
        this.$vs.notify({
          position:'top-center',
          text: this.$t('noActivityOfThisTypeSelected'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })

        return
      }
    }
  }
}
