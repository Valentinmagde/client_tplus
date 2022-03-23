    //importation de jspdf
    import jsPDF from 'jspdf'
    import 'jspdf-autotable'
    // i18n
    import i18n from '@/services/i18n/i18n'

    const options = { month: "long", day: "numeric", year: "numeric" };
    //exporation du tableau en csv
    function csvExport(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
          // Traduction selon la langue de l'utilisateur
          if (locale == "en"){
            donnees.push(
             {
                "Account": arrData[key].membre,
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
                "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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

        if(locale == 'en' )
          link.setAttribute("download", `${ass.nom}_settlements_${getFormattedTime()}.csv`);
        else
          link.setAttribute("download", `${ass.nom}_échéances_${getFormattedTime()}.csv`);

        link.click();
    }

     //exporation du tableau en csv
    function exportExel(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
          // Traduction selon la langue de l'utilisateur
            if (locale == "en"){
                donnees.push(
                {
                    "Account": arrData[key].membre,
                    "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
                    "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
        
        if(locale == 'en')
          link.setAttribute("download",`${ass.nom}_settlments_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download",`${ass.nom}_échéances_${getFormattedTime()}.xls`)

        link.click();
    }

    function exportPDF(arrData, ass){
      getDataUri(ass.logo, function (dataUri) {                    
          generatePdf(arrData, dataUri, ass);
      });
    }

    function getDataUri(url, cb)
    {             
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            //next three lines for white background in case png has a transparent background
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';  /// set white fill style
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            canvas.getContext('2d').drawImage(this, 0, 0);

            cb(canvas.toDataURL('image/jpeg'));
        };
        image.src = url;                
    }

    function generatePdf(arrData, img, ass) {                
      var donnees = []
      var columns = []
        const locale = i18n.locale;

        Object.keys(arrData).forEach(function(key){

            if (locale == "en"){
                donnees.push(
                {
                  "Account": arrData[key].membre,
                  "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                  "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                  "Creation Date": new Date(arrData[key].date_creation*1000).toDateString(),
                  "Payment Method": arrData[key].mode,
                  "State": 'Waiting',
                }
              )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Compte": arrData[key].membre,
                      "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleDateString('fr', options),
                      "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                      "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleDateString('fr', options),
                      "Méthode de payement": arrData[key].mode,
                      "Etat": 'En attente',
                    }
                )
            }
        })

        var doc =  new jsPDF('p', 'pt');
        let date=new Date();

        let datelocal= locale == 'en' ? date.toLocaleString('en-US',{weekday:'long',year:'numeric',month:'long',})
                                      : date.toLocaleString('fr-Fr',{weekday:'long',year:'numeric',month:'long',})
        let setDate = datelocal
        let width = doc.internal.pageSize.width;
        /* let assName = ass.nom; */ 
        let txtWidth = doc.getTextWidth(setDate) > 70 ? doc.getTextWidth(setDate) - 70: 0;
        
        doc.autoTable(columns, donnees, { margin: {top: 220},});
        let header = function(data){
          if(data.pageCount == 1){
            //Logo de l'association
            doc.addImage(img,"JPEG",data.settings.margin.left + 20, 50, 40, 40);

            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.text(ass.nom, 40, 105);

            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.setFontType('bold');
            doc.text(width - 70 - Math.ceil(txtWidth), 90, 'Tontine.Plus');

            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.text(width - 70 - Math.ceil(txtWidth), 105, setDate);
          }
        }

        let options = {
          didDrawPage : header,
          margin: {
            top: 100
          },
          startY: doc.autoTableEndPosY() + 20
        }
        
        let caption = ""
        /* let txtWidth2 = "" */
        let splitDescription = "";

        switch(locale){
          case 'en':
              caption = `Settlements for all members of the association`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
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
              caption = `Échéances de tous les membres de l'association`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
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

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_settlment_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_échéances_${getFormattedTime()}.pdf`); 
    }
     //exporation du tableau en csv
     function csvExportHistoric(arrData, ass) {
      var donnees = []
      const locale = i18n.locale; //Recupération de la langue de l'utilisateur

       Object.keys(arrData).forEach(function(key){
        // Traduction selon la langue de l'utilisateur
        if (locale == "en"){
          donnees.push(
           {
              "Account": arrData[key].membre,
              "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
              "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
              "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleDateString('fr', options),
              "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
              "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleDateString('fr', options),
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

      if(locale=='en')
        link.setAttribute("download", `${ass.nom}_historical_${getFormattedTime()}.csv`);
      else
        link.setAttribute("download", `${ass.nom}_historique_${getFormattedTime()}.csv`);

      link.click();
    }

    function exportPDFHistoric(arrData,ass){
      var donnees = []
      var columns = []
        const locale = i18n.locale;

        Object.keys(arrData).forEach(function(key){

            if (locale == "en"){
                donnees.push(
                {
                    "Account": arrData[key].membre,
                    "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
                      "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleDateString('fr', options),
                      "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                      "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleDateString('fr', options),
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

        if(locale == 'en')
          doc.save(`${ass.nom}_historical_${getFormattedTime()}.pdf`);
        else
          doc.save(`${ass.nom}_historique_${getFormattedTime()}.pdf`);
    }

    //exporation du tableau en csv
    function exportExelHistoric(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

        Object.keys(arrData).forEach(function(key){
          // Traduction selon la langue de l'utilisateur
            if (locale == "en"){
                donnees.push(
                {
                    "Account": arrData[key].membre,
                    "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
                    "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleDateString('fr', options),
                    "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                    "Date de Creation": new Date(arrData[key].date_creation*1000).toLocaleDateString('fr', options),
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

        if(locale=='en')
          link.setAttribute("download", `${ass.nom}_historical_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download", `${ass.nom}_historique_${getFormattedTime()}.xls`);

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

    function getFormattedTime() {
      var today = new Date();
      var y = today.getFullYear();
      // JavaScript months are 0-based.
      var m = ("0" + (today.getMonth() + 1)).slice(-2);
      var d = ("0" + (today.getDate())).slice(-2);
      var h = today.getHours();
      var mi = today.getMinutes();
      var s = today.getSeconds();
      return `${y}${m}${d}_${h}${mi}${s}`;
    }

    export default {
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
