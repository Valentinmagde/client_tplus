    // Vue Router
    import router from '@/router'

    //Redirection vers la page de création d'une tontine
    function redirectTontine() {
         //Vider les caches s'ils existent

         if(localStorage.getItem('tontine_modif') != null){
            localStorage.removeItem('tontine_modif')
          }
          if(localStorage.getItem('activite_creee') != null){
            localStorage.removeItem('activite_creee')
          }
          if(localStorage.getItem('tontine_creee') != null){
            localStorage.removeItem('tontine_creee')
          }
          if(localStorage.getItem('lots') != null){
            localStorage.removeItem('lots')
          }
          if(localStorage.getItem('membre_inscris') != null){
            localStorage.removeItem('membre_inscris')
          }
          if(localStorage.getItem('comptes') != null){
            localStorage.removeItem('comptes')
          }
          if(localStorage.getItem('lots_restant') != null){
            localStorage.removeItem('lots_restant')
          }
          if(localStorage.getItem('calendriers') != null){
            localStorage.removeItem('calendriers')
          }localStorage.removeItem('tirage_au_sort')

          if(localStorage.getItem('tirage_au_sort') != null){
            localStorage.removeItem('tirage_au_sort')
          }

          if(localStorage.getItem('attribution_variable') != null){
            localStorage.removeItem('attribution_variable')
          }

        localStorage.removeItem('activity_id');

        router.push('/association/administration/activity/tontine/create').catch(() => {})
    }

    //Redirection vers la page de création d'une mutuelle
    function redirectMutuelle() {
      //Vider les caches s'ils existent
      // if(localStorage.getItem('activite_modif') != null){
      //    localStorage.removeItem('activite_modif')
      // }
      // if(localStorage.getItem('epargne_modif') != null){
      //   localStorage.removeItem('epargne_modif')
      // }
      // if(localStorage.getItem('activite_creee') != null){
      //     localStorage.removeItem('activite_creee')
      // }
      // if(localStorage.getItem('epargne_creee') != null){
      //     localStorage.removeItem('epargne_creee')
      // }

      // if(localStorage.getItem('membre_inscris') != null){
      //     localStorage.removeItem('membre_inscris')
      // }
      // if(localStorage.getItem('membres_selectionnes') != null){
      //     localStorage.removeItem('membres_selectionnes')
      // }

      // if(localStorage.getItem('comptes') != null){
      //   localStorage.removeItem('comptes')
      // }

      localStorage.removeItem('activity_id');

      router.push('/association/administration/activity/mutual/create').catch(() => {})
    }

    //Redirection vers la page de création d'une activité générique
    function redirectGeneric() {
      //   //Vider les caches s'ils existent
      //   if(localStorage.getItem('activite_modif') != null){
      //      localStorage.removeItem('activite_modif')
      //   }
      //   if(localStorage.getItem('activite_creee') != null){
      //       localStorage.removeItem('activite_creee')
      //   }
      //   if(localStorage.getItem('tontine_creee') != null){
      //       localStorage.removeItem('tontine_creee')
      //   }

      //   if(localStorage.getItem('membre_inscris') != null){
      //       localStorage.removeItem('membre_inscris')
      //   }
      //   if(localStorage.getItem('membres_selectionnes') != null){
      //       localStorage.removeItem('membres_selectionnes')
      //   }

      //   if(localStorage.getItem('comptes') != null){
      //       localStorage.removeItem('comptes')
      //   }

      //   if(localStorage.getItem('membres_incris_activite_generique') != null){
      //     localStorage.removeItem('membres_incris_activite_generique')
      // }

        localStorage.removeItem('activity_id');

        router.push('/association/administration/activity/generic/create').catch(() => {})
   }

   //Redirection vers la page de création d'une activité générique
   function redirectEvent() {
        //Vider les caches s'ils existent
        // if(localStorage.getItem('activite_modif') != null){
        // localStorage.removeItem('activite_modif')
        // }
        // if(localStorage.getItem('activite_creee') != null){
        //     localStorage.removeItem('activite_creee')
        // }
        // if(localStorage.getItem('tontine_creee') != null){
        //     localStorage.removeItem('tontine_creee')
        // }

        // if(localStorage.getItem('membre_inscris') != null){
        //     localStorage.removeItem('membre_inscris')
        // }
        // if(localStorage.getItem('membres_selectionnes') != null){
        //     localStorage.removeItem('membres_selectionnes')
        // }

        // if(localStorage.getItem('comptes') != null){
        //     localStorage.removeItem('comptes')
        // }

        // if(localStorage.getItem('evenement_modif') != null){
        //     localStorage.removeItem('evenement_modif')
        // }

        // if(localStorage.getItem('evenement_creee') != null){
        //     localStorage.removeItem('evenement_creee')
        // }

        localStorage.removeItem('activity_id');

        router.push('/association/administration/activity/event/create').catch(() => {})
    }

   //Redirection vers la page de création d'une activité solidarite
   function redirectSolidarity() {
    //Vider les caches s'ils existent
    // if(localStorage.getItem('solidarite_modif') != null){
    // localStorage.removeItem('solidarite_modif')
    // }
    // if(localStorage.getItem('activite_creee') != null){
    //     localStorage.removeItem('activite_creee')
    // }
    // if(localStorage.getItem('solidarite_creee') != null){
    //     localStorage.removeItem('solidarite_creee')
    // }

    // if(localStorage.getItem('membre_inscris') != null){
    //     localStorage.removeItem('membre_inscris')
    // }
    // if(localStorage.getItem('membres_selectionnes') != null){
    //     localStorage.removeItem('membres_selectionnes')
    // }

    // if(localStorage.getItem('comptes') != null){
    //     localStorage.removeItem('comptes')
    // }

    localStorage.removeItem('activity_id');

    router.push('/association/administration/activity/solidarity/create').catch(() => {})
}


    export default {
        redirectTontine,
        redirectGeneric,
        redirectEvent,
        redirectMutuelle,
        redirectSolidarity,
    }
