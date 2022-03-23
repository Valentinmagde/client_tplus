  //importation de jspdf
  import jsPDF from 'jspdf'
  import 'jspdf-autotable'
  // i18n
  import i18n from '@/services/i18n/i18n'

  const options = { month: "long", day: "numeric", year: "numeric" };

  //exporation du tableau en csv
  function csvExport(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

    Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
      if (locale == "en"){
        donnees.push(
        {
            "Account": arrData[key].membre,
            "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
            "Amount": arrData[key].montant,
            "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
            "Payment Method": arrData[key].mode,
            "State": 'Waiting',
        }
      )
      }else if(locale == "fr"){
        donnees.push(
        {
            "Compte": arrData[key].membre,
            "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
            "Montant": arrData[key].montant,
            "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
            "Méthode de payement": arrData[key].mode,
            "Etat": 'En attente',
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
    link.setAttribute("download", "versement_en_attene.csv");

    link.click();
  }

  function exportPDF(arrData){
  var donnees = []
  var columns = []
    const locale = i18n.locale;

    Object.keys(arrData).forEach(function(key){

        if (locale == "en"){
            donnees.push(
            {
                "Account": arrData[key].membre,
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant,
                "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
                "Payment Method": arrData[key].mode,
                "State": 'Waiting',
            }
          )
        }else if(locale == "fr"){
            donnees.push(
                {
                  "Compte": arrData[key].membre,
                  "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                  "Montant": arrData[key].montant,
                  "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
                  "Méthode de payement": arrData[key].mode,
                  "Etat": 'En attente',
                }
            )
        }
    })

    var doc =  new jsPDF('p', 'pt');
    switch(locale){
      case 'en':
          doc.text('PAYMENTS PENDING VALIDATION', 40, 40);
          columns = [
                {title: "Account", dataKey: "Account"},
                {title: "Payment Date", dataKey: "Payment Date"},
                {title: "Amount", dataKey: "Amount"},
                {title: "Creation Date", dataKey: "Creation Date"},
                {title: "Payment Method", dataKey: "Payment Method"},
                {title: "State", dataKey: "State"},
              ];
          break;
      case 'fr':
        doc.text('VERSEMENTS EN ATTENTE DE VALIDATION', 40, 40);
          columns = [
                {title: "Compte", dataKey: "Compte"},
                {title: "Date de Versement", dataKey: "Date de Versement"},
                {title: "Montant", dataKey: "Montant"},
                {title: "Date de Creation", dataKey: "Date de Creation"},
                {title: "Méthode de payement", dataKey: "Méthode de payement"},
                {title: "Etat", dataKey: "Etat"},
              ];
          break;
    }

    doc.autoTable(columns, donnees, {
      margin: {top: 60},
    });
    doc.save('versement_en_attente.pdf');
  }

  //exporation du tableau en csv
  function exportExel(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

    Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
        if (locale == "en"){
            donnees.push(
            {
                "Account": arrData[key].membre,
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant,
                "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
                "Payment Method": arrData[key].mode,
                "State": 'Waiting',
            }
        )
        }else if(locale == "fr"){
            donnees.push(
                {
                "Compte": arrData[key].membre,
                "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                "Montant": arrData[key].montant,
                "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
                "Méthode de payement": arrData[key].mode,
                "Etat": 'En attente',
                }
            )
        }
    })
    let csvContent = "data:application/vnd.ms-excel,";
    csvContent += [
      Object.keys(donnees[0]).join(";"),
      ...donnees.map(item => Object.values(item).join(";"))
    ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "versement_en_attente.xls");

    link.click();
  }

  //exporation du tableau en csv
  function csvExportHistoric(arrData) {
  var donnees = []
  const locale = i18n.locale; //Recupération de la langue de l'utilisateur

  Object.keys(arrData).forEach(function(key){
    // Traduction selon la langue de l'utilisateur
    if (locale == "en"){
      donnees.push(
      {
          "Account": arrData[key].membre,
          "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
          "Amount": arrData[key].montant,
          "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
          "Payment Method": arrData[key].mode,
          "State": 'Waiting',
          "Type": arrData[key].debit_credit == 'credit'? 'Payment': 'Withdrawal'
      }
    )
    }else if(locale == "fr"){
      donnees.push(
      {
          "Compte": arrData[key].membre,
          "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
          "Montant": arrData[key].montant,
          "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
          "Méthode de payement": arrData[key].mode,
          "Etat": 'En attente',
          "Type": arrData[key].debit_credit == 'credit'? 'Versement': 'Retrait'
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
  link.setAttribute("download", "historique.csv");

  link.click();
  }

  function exportPDFHistoric(arrData){
  var donnees = []
  var columns = []
    const locale = i18n.locale;

    Object.keys(arrData).forEach(function(key){

        if (locale == "en"){
            donnees.push(
            {
                "Account": arrData[key].membre,
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant,
                "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
                "Payment Method": arrData[key].mode,
                "State": 'Waiting',
                "Type": arrData[key].debit_credit == 'credit'? 'Payment': 'Withdrawal'
            }
          )
        }else if(locale == "fr"){
            donnees.push(
                {
                  "Compte": arrData[key].membre,
                  "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                  "Montant": arrData[key].montant,
                  "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
                  "Méthode de payement": arrData[key].mode,
                  "Etat": 'En attente',
                  "Type": arrData[key].debit_credit == 'credit'? 'Versement': 'Retrait'
                }
            )
        }
    })

    var doc =  new jsPDF('p', 'pt');
    switch(locale){
      case 'en':
          doc.text('PAYMENT AND WITHDRAWAL HISTORIES', 40, 40);
          columns = [
                {title: "Account", dataKey: "Account"},
                {title: "Payment Date", dataKey: "Payment Date"},
                {title: "Amount", dataKey: "Amount"},
                {title: "Creation Date", dataKey: "Creation Date"},
                {title: "Payment Method", dataKey: "Payment Method"},
                {title: "State", dataKey: "State"},
                {title: "Type", dataKey: "Type"},
              ];
          break;
      case 'fr':
        doc.text('HISTORIQUES DES VERSEMENTS ET RETRAITS', 40, 40);
          columns = [
                {title: "Compte", dataKey: "Compte"},
                {title: "Date de Versement", dataKey: "Date de Versement"},
                {title: "Montant", dataKey: "Montant"},
                {title: "Date de Creation", dataKey: "Date de Creation"},
                {title: "Méthode de payement", dataKey: "Méthode de payement"},
                {title: "Etat", dataKey: "Etat"},
                {title: "Type", dataKey: "Type"},
              ];
          break;
    }

    doc.autoTable(columns, donnees, {
      margin: {top: 60},
    });
    doc.save('historique.pdf');
  }

  //exporation du tableau en csv
  function exportExelHistoric(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

    Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
        if (locale == "en"){
            donnees.push(
            {
                "Account": arrData[key].membre,
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant,
                "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
                "Payment Method": arrData[key].mode,
                "State": 'Waiting',
                "Type": arrData[key].debit_credit == 'credit'? 'Payment': 'Withdrawal'
            }
        )
        }else if(locale == "fr"){
            donnees.push(
                {
                "Compte": arrData[key].membre,
                "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                "Montant": arrData[key].montant,
                "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleString('fr', options),
                "Méthode de payement": arrData[key].mode,
                "Etat": 'En attente',
                "Type": arrData[key].debit_credit == 'credit'? 'Versement': 'Retrait'
                }
            )
        }
    })
    let csvContent = "data:application/vnd.ms-excel,";
    csvContent += [
      Object.keys(donnees[0]).join(";"),
      ...donnees.map(item => Object.values(item).join(";"))
    ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "historique.xls");

    link.click();
  }
  //exporation du tableau en csv
  function csvExportTresorerie(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

    Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
      if (locale == "en"){
        donnees.push(
        {
            "Heading": arrData[key].activite.type,
            "Name" : arrData[key].activite.nom,
            "Amount": arrData[key].tresorerie,
        }
      )
      }else if(locale == "fr"){
        donnees.push(
        {
          "Rubrique": arrData[key].activite.type,
          "Nom" : arrData[key].activite.nom,
          "Montant": arrData[key].tresorerie,
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
    link.setAttribute("download", "tresorerie.csv");

    link.click();
  }

  function exportPDFTresorerie(arrData){
  var donnees = []
  var columns = []
    const locale = i18n.locale;

    Object.keys(arrData).forEach(function(key){

      if (locale == "en"){
        donnees.push(
        {
            "Heading": arrData[key].activite.type,
            "Name" : arrData[key].activite.nom,
            "Amount": arrData[key].tresorerie,
        }
      )
      }else if(locale == "fr"){
        donnees.push(
        {
          "Rubrique": arrData[key].activite.type,
          "Nom" : arrData[key].activite.nom,
          "Montant": arrData[key].tresorerie,
        }
      )
      }
    })
    var doc =  new jsPDF('p', 'pt');
    switch(locale){
      case 'en':
          doc.text('STATEMENT OF CASH', 40, 40);
          columns = [
                {title: "Heading", dataKey: "Heading"},
                {title: "Name", dataKey: "Name"},
                {title: "Amount", dataKey: "Amount"},
              ];
          break;
      case 'fr':
        doc.text('ÉTAT DE LA TRÉSORERIE', 40, 40);
          columns = [
                {title: "Rubrique", dataKey: "Rubrique"},
                {title: "Nom", dataKey: "Nom"},
                {title: "Montant", dataKey: "Montant"},
              ];
          break;
    }

    doc.autoTable(columns, donnees, {
      margin: {top: 60},
    });
    doc.save('tresorerie.pdf');
  }

  //exporation du tableau en csv
  function exportExelTresorerie(arrData) {
    var donnees = []
    const locale = i18n.locale; //Recupération de la langue de l'utilisateur

    Object.keys(arrData).forEach(function(key){
      // Traduction selon la langue de l'utilisateur
      if (locale == "en"){
        donnees.push(
        {
            "Heading": arrData[key].activite.type,
            "Name" : arrData[key].activite.nom,
            "Amount": arrData[key].tresorerie,
        }
      )
      }else if(locale == "fr"){
        donnees.push(
        {
          "Rubrique": arrData[key].activite.type,
          "Nom" : arrData[key].activite.nom,
          "Montant": arrData[key].tresorerie,
        }
      )
      }
    })
    let csvContent = "data:application/vnd.ms-excel,";
    csvContent += [
      Object.keys(donnees[0]).join(";"),
      ...donnees.map(item => Object.values(item).join(";"))
    ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "tresorerie.xls");

    link.click();
  }
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
        //Verifier si la date de fin du cycle est inferieur à la date actuelle
        //Si oui alors le cycle est cloturé, et actif sinon
        if(cycles[key].cycle.etat == 'cloture') {
          cycleClotures[inc] = cycles[key]
          inc ++
        }
      })

      return cycleClotures
  }

  function prochaineAg(ags){
    //Prochaine ag
    var prochaine_ag = null

    //Parcours de tous les ags du cycle actif de l'association
    Object.keys(ags).forEach(function(key) {
      if(ags[0].id !== ags[key].id){
        //
        if(new Date() > new Date(ags[key-1].date_ag*1000) &&
        new Date() < new Date(ags[key].date_ag*1000)) {
          prochaine_ag = ags[key]
        }
      }else{
        if(ags[0].id == ags[key].id &&
          new Date() < new Date(ags[key].date_ag*1000)){
            prochaine_ag = ags[key]
          }
      }
    })

    return prochaine_ag
  }

  export default {
    afficherCycleActif,
    afficherCycleClotures,
    prochaineAg,
    csvExport,
    exportPDF,
    exportExel,
    csvExportTresorerie,
    exportPDFTresorerie,
    exportExelTresorerie,
    exportPDFHistoric,
    exportExelHistoric,
    csvExportHistoric
  }
