    //importation de jspdf
    import jsPDF from 'jspdf'
    import 'jspdf-autotable'
    // i18n
    import i18n from '@/services/i18n/i18n'

    const options = {month: "long", day: "numeric", year: "numeric"};
    //exporation du tableau en csv
    function csvExport(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
          // Traduction selon la langue de l'utilisateur
          if (locale == "en"){
            donnees.push(
             {
                "Members": arrData[key].membre,
                "Wording" : arrData[key].libelle,
                "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
             }
           )
          }else if(locale == "fr"){
            donnees.push(
             {
                "Membres": arrData[key].membre,
                "Libellé" : arrData[key].libelle,
                "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
             }
           )
          }
         })
         
        let csvContent ="data:text/csv;charset=utf-8,\uFEFF";
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
          link.setAttribute("download", `${ass.nom}_echeances_${getFormattedTime()}.csv`);

        link.click();
    }

    //exporation du tableau en fichier excel
    function exportExel(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
          // Traduction selon la langue de l'utilisateur
            if (locale == "en"){
                donnees.push(
                {
                    "Members": arrData[key].membre,
                    "Wording" : arrData[key].libelle,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
            )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Membres": arrData[key].membre,
                      "Libellé" : arrData[key].libelle,
                      "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                      "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
          link.setAttribute("download",`${ass.nom}_echeances_${getFormattedTime()}.xls`)

        link.click();
    }

    //exporation du tableau en fichier pdf
    function exportPDF(arrData, ass){
      getDataUri(ass.logo, function (dataUri) {                    
          generatePdf(arrData, dataUri, ass);
      });
    }

    function generatePdf(arrData, img, ass) {                
      var donnees = []
      var columns = []
        const locale = i18n.locale;

        Object.keys(arrData).forEach(function(key){

            if (locale == "en"){
                donnees.push(
                {
                  "Members": arrData[key].membre,
                  "Wording" : arrData[key].libelle,
                  "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                  "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Membres": arrData[key].membre,
                      "Libellé" : arrData[key].libelle,
                      "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                      "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
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
          columnStyles: {
            0: { cellWidth: 100 }, //frequency
            1: { cellWidth: 215}, //task name
            2: { cellWidth: 100 }, // shift
            3: { cellWidth: 100}, //range
          },
          startY: doc.lastAutoTable.finalY + 20
        }
        
        let caption = ""
        /* let txtWidth2 = "" */
        let splitDescription = "";

        switch(locale){
          case 'en':
              caption = `SETTLEMENTS AND ASSETS OF ALL MEMBERS`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Members", dataKey: "Members"},
                    {title: "Wording", dataKey: "Wording"},
                    {title: "Deadline", dataKey: "Deadline"},
                    {title: "Amount", dataKey: "Amount"},
                  ];
              break;
          case 'fr':
              caption = `ECHEANCES ET AVOIRS DE TOUS LES MEMBRES`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Membres", dataKey: "Membres"},
                    {title: "Libellé", dataKey: "Libellé"},
                    {title: "Date limite", dataKey: "Date limite"},
                    {title: "Montant", dataKey: "Montant"},
                  ];
              break;
        }

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_settlment_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_echeances_${getFormattedTime()}.pdf`); 
    }   

    //exporater le tableau des détails en csv
    function csvExportDetail(arrData, ass) {
      var donnees = []
      const locale = i18n.locale; //Recupération de la langue de l'utilisateur

       Object.keys(arrData).forEach(function(key){
          let debit_credit = arrData[key].debit_credit

        // Traduction selon la langue de l'utilisateur
        switch(locale){
          case 'en':
            switch(debit_credit){
              case 'cotisation':
                debit_credit = 'Contribution'
                break;
              
                case 'acquitement':
                  debit_credit = 'Acquittal'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Disbursement'
                  break;
                
                case 'dette':
                  debit_credit = 'Debt'
                  break;

                default:
                  break;
            }

            donnees.push(
              {
                  "Wording" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                  "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
              }
            )
            break;
          case 'fr':
            switch(debit_credit){
              case 'cotisation':
                debit_credit = 'Cotisation'
                break;
              
                case 'acquitement':
                  debit_credit = 'Acquittement'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Decaissement'
                  break;
                
                case 'dette':
                  debit_credit = 'Dette'
                  break;

                default:
                  break;
            }

            donnees.push(
              {
                  "Libellé" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Date limite": new Date(arrData[key].date_limite*1000).toLocaleString('fr', options),
                  "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
              }
            )
            break;
          default:
            break;
        }
       })
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
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
        link.setAttribute("download", `${ass.nom}_settlement_${getFormattedTime()}.csv`);
      else
        link.setAttribute("download", `${ass.nom}_echeances_${getFormattedTime()}.csv`);

      link.click();
    }

    function exportPDFDetail(arrData, ass){
      getDataUri(ass.logo, function (dataUri) {                    
        generatePDFDetail(arrData, dataUri, ass);
      });
    }

    function generatePDFDetail(arrData, img, ass) {                
      var donnees = []
      var columns = []
      const locale = i18n.locale;

      Object.keys(arrData).forEach(function(key){
          let debit_credit = arrData[key].debit_credit

          switch(locale){
            case 'en':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Contribution'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittal'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Disbursement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Debt'
                    break;

                  default:
                    break;
              }

              donnees.push(
                {
                    "Wording" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
              break;

            case 'fr':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Cotisation'
                  break;
                
                case 'acquitement':
                  debit_credit = 'Acquittement'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Decaissement'
                  break;
                
                case 'dette':
                  debit_credit = 'Dette'
                  break;

                default:
                  break;
              }

              donnees.push(
                {
                  "Libellé" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                  "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 })
                }
              )
              break;

            default:
              break;
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
          tableWidth: 'auto',
          didDrawPage : header,
          margin: {
            top: 100
          },
          startY: doc.lastAutoTable.finalY + 20
        }
        
        let caption = ""
        /* let txtWidth2 = "" */
        let splitDescription = "";

        switch(locale){
          case 'en':
              caption = `SETTLEMENTS AND DEBTS`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Wording", dataKey: "Wording"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Deadline", dataKey: "Deadline"},
                    {title: "Amount", dataKey: "Amount"},
                  ];
              break;
          case 'fr':
              caption = `ECHEANCES ET DETTES`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Libellé", dataKey: "Libellé"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Date limite", dataKey: "Date limite"},
                    {title: "Montant", dataKey: "Montant"},
                  ];
              break;
        }

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_settlment_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_echeances_${getFormattedTime()}.pdf`); 
    }  

    //exporater tableau des détails en excel
    function exportExelDetail(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

        Object.keys(arrData).forEach(function(key){
            let debit_credit = arrData[key].debit_credit

          // Traduction selon la langue de l'utilisateur
          switch(locale){
            case 'en':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Contribution'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittal'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Disbursement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Debt'
                    break;
  
                  default:
                    break;
              }
  
              donnees.push(
                {
                    "Wording" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
              break;
            case 'fr':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Cotisation'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittement'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Decaissement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Dette'
                    break;
  
                  default:
                    break;
              }
  
              donnees.push(
                {
                    "Libellé" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Date limite": new Date(arrData[key].date_limite*1000).toLocaleString('fr', options),
                    "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
              break;
            default:
              break;
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
          link.setAttribute("download", `${ass.nom}_settlement_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download", `${ass.nom}_echeances_${getFormattedTime()}.xls`);

        link.click();
    }

    //exporation du tableau en csv
    function csvExportAdminSettlement(arrData, ass) {
      var donnees = []
      const locale = i18n.locale; //Recupération de la langue de l'utilisateur

       Object.keys(arrData).forEach(function(key){
          let debit_credit = arrData[key].debit_credit

        // Traduction selon la langue de l'utilisateur
        switch (locale){
          case 'en':
            switch(debit_credit){
              case 'cotisation':
                debit_credit = 'Contribution'
                break;
              
                case 'acquitement':
                  debit_credit = 'Acquittal'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Disbursement'
                  break;
                
                case 'dette':
                  debit_credit = 'Debt'
                  break;

                default:
                  break;
            }

            donnees.push(
              {
                  "Members": arrData[key].membre,
                  "Wording" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                  "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
              }
            )
            break;

          case 'fr':
            switch(debit_credit){
              case 'cotisation':
                debit_credit = 'Cotisation'
                break;
              
                case 'acquitement':
                  debit_credit = 'Acquittement'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Decaissement'
                  break;
                
                case 'dette':
                  debit_credit = 'Dette'
                  break;

                default:
                  break;
            }

            donnees.push(
              {
                  "Membres": arrData[key].membre,
                  "Libellé" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                  "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
              }
            )
        }
      })

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
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
        link.setAttribute("download", `${ass.nom}_settlement_${getFormattedTime()}.csv`);
      else
        link.setAttribute("download", `${ass.nom}_echeances_${getFormattedTime()}.csv`);

      link.click();
    }

    //exporation du tableau en excel
    function exportExcelAdminSettlement(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

        Object.keys(arrData).forEach(function(key){
            let debit_credit = arrData[key].debit_credit

          // Traduction selon la langue de l'utilisateur
          switch (locale){
            case 'en':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Contribution'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittal'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Disbursement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Debt'
                    break;
  
                  default:
                    break;
              }
  
              donnees.push(
                {
                    "Members": arrData[key].membre,
                    "Wording" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
              break;
  
            case 'fr':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Cotisation'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittement'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Decaissement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Dette'
                    break;
  
                  default:
                    break;
              }
  
              donnees.push(
                {
                    "Membres": arrData[key].membre,
                    "Libellé" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                    "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
          }
        })
        let excelContent = "data:application/vnd.ms-excel,";
        excelContent += [
          Object.keys(donnees[0]).join(";"),
          ...donnees.map(item => Object.values(item).join(";"))
        ]
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");

        const data = encodeURI(excelContent);
        const link = document.createElement("a");
        link.setAttribute("href", data);

        if(locale == 'en')
          link.setAttribute("download", `${ass.nom}_settlement_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download", `${ass.nom}_echeances_${getFormattedTime()}.xls`);

        link.click();
    }

    function exportPDFAdminSettlement(arrData, ass){
      getDataUri(ass.logo, function (dataUri) {                    
        generatePDFAdminSettlement(arrData, dataUri, ass);
      });
    }

    function generatePDFAdminSettlement(arrData, img, ass) {                
      var donnees = []
      var columns = []
      const locale = i18n.locale;

      Object.keys(arrData).forEach(function(key){
          let debit_credit = arrData[key].debit_credit

          switch(locale){
            case 'en':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Contribution'
                  break;
                
                  case 'acquitement':
                    debit_credit = 'Acquittal'
                    break;
                  
                  case 'decaissement':
                    debit_credit = 'Disbursement'
                    break;
                  
                  case 'dette':
                    debit_credit = 'Debt'
                    break;

                  default:
                    break;
              }

              donnees.push(
                {
                    "Members": arrData[key].membre,
                    "Wording" : arrData[key].libelle,
                    "Type" : debit_credit,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                }
              )
              break;

            case 'fr':
              switch(debit_credit){
                case 'cotisation':
                  debit_credit = 'Cotisation'
                  break;
                
                case 'acquitement':
                  debit_credit = 'Acquittement'
                  break;
                
                case 'decaissement':
                  debit_credit = 'Decaissement'
                  break;
                
                case 'dette':
                  debit_credit = 'Dette'
                  break;

                default:
                  break;
              }

              donnees.push(
                {
                  "Membres": arrData[key].membre,
                  "Libellé" : arrData[key].libelle,
                  "Type" : debit_credit,
                  "Date limite": new Date(arrData[key].date_limite*1000).toLocaleDateString('fr', options),
                  "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 })
                }
              )
              break;

            default:
              break;
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
          tableWidth: 'auto',
          didDrawPage : header,
          margin: {
            top: 100
          },

          columnStyles: {
            0: { cellWidth: 100 }, //frequency
            1: { cellWidth: 150}, //task name
            2: { cellWidth: 75 }, // shift
            3: { cellWidth: 90}, //range
            4: { cellWidth: 100 },
          },
          startY: doc.lastAutoTable.finalY + 20
        }
        
        let caption = ""
        /* let txtWidth2 = "" */
        let splitDescription = "";

        switch(locale){
          case 'en':
              caption = `SETTLEMENTS AND DEBTS OF ALL MEMBERS`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Members", dataKey: "Members"},
                    {title: "Wording", dataKey: "Wording"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Deadline", dataKey: "Deadline"},
                    {title: "Amount", dataKey: "Amount"},
                  ];
              break;
          case 'fr':
              caption = `ECHEANCES ET DETTES DE TOUS LES MEMBRES`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Membres", dataKey: "Membres"},
                    {title: "Libellé", dataKey: "Libellé"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Date limite", dataKey: "Date limite"},
                    {title: "Montant", dataKey: "Montant"},
                  ];
              break;
        }

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_settlment_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_echeances_${getFormattedTime()}.pdf`); 
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
        csvExportDetail,
        exportPDFDetail,
        exportExelDetail,
        csvExportAdminSettlement,
        exportPDFAdminSettlement,
        exportExcelAdminSettlement
    }
