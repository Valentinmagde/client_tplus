
    function afficherCycleActif(cycle) {
      var cycleActif = null
      //Parcours de tous les cycles de l'association
      Object.keys(cycle).forEach(function(key) {
        //Verifier si la date de fin du cycle est inferieur à la date actuelle
        //Si oui alors le cycle est cloturé, et actif sinon
        if(cycle[key].cycle.etat == 'create'
          || cycle[key].cycle.etat == 'init'
          || cycle[key].cycle.etat == 'actif') {
            cycleActif = cycle[key]
        }
      })

      return cycleActif
  }

  function afficherCycleClotures(cycles){
      var inc = 0
      var cycleClotures = new Array()
      //Parcours de tous les cycles de l'association
      Object.keys(cycles).forEach(function(key) {
        if(cycles[key].cycle.etat == 'create') {
          cycleClotures[inc] = cycles[key]
          inc ++
        }
      })

      return cycleClotures
  }

  function prochaineAg(ags){
    //Prochaine ag
    var prochaine_ag = null

    ags.forEach(element=>{
      if(element.etat == 'current')
        prochaine_ag = element
    })

    return prochaine_ag
  }

  export default {
    afficherCycleActif,
    afficherCycleClotures,
    prochaineAg
  }
