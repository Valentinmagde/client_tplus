
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

  //Moment
  import * as moment from 'moment';
  import localisation from  'moment/locale/fr';

  moment.updateLocale('en', localisation)
  // i18n
  import i18n from '@/services/i18n/i18n'
  //exporation du tableau en csv
  function csvMutualPaymentsExport(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

     Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
      if (locale == "en"){
        donnees.push(
         {
            "membres_id": arrData[key].membres_id,
            nom: arrData[key].membre,
            "date_versement" : moment.unix(arrData[key].statistiques.details[0].date_created).format('L'),
            "montant": '',
         }
       )
      }else if(locale == "fr"){
        donnees.push(
         {
          "membres_id": arrData[key].membres_id,
          nom: arrData[key].membre,
          "date_versement" : moment.unix(arrData[key].statistiques.details[0].date_created).format('L'),
          "montant": '',
         }
       )
      }
     })
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      Object.keys(donnees[0]).join(";"),
      ...donnees.map(item => Object.values(item).join(";"))
    ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "epargne_credit.csv");

    link.click();
}


  export default {
    afficherCycleActif,
    afficherCycleClotures,
    prochaineAg,
    csvMutualPaymentsExport,
  }
