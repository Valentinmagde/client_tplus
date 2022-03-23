    //importation de jspdf
    import jsPDF from 'jspdf'
    import 'jspdf-autotable'
    // i18n
    import i18n from '@/services/i18n/i18n'

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
                "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                "Type": arrData[key].debit_credit=='credit'? 'Payment': 'Withdrawal',
                "Payment Method": arrData[key].mode,
                "Stat": arrData[key].etat=='EN_ATTENTE'? 'Waiting'
                      : arrData[key].etat=='VALIDE'? 'Validated'
                      : arrData[key].etat=='REJETE'? 'Rejected'
                      : 'Cancel',
             }
           )
          }else if(locale == "fr"){
            donnees.push(
             {
                "Membres": arrData[key].membre,
                "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                "Type": arrData[key].debit_credit=='credit'? 'Versement': 'Retrait',
                "Méthode de payement": arrData[key].mode,
                "Etat": arrData[key].etat=='EN_ATTENTE'? 'En attente'
                      : arrData[key].etat=='VALIDE'? 'Validée'
                      : arrData[key].etat=='REJETE'? 'Rejetée'
                      : 'Annulée',
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
          link.setAttribute("download", `${ass.nom}_operations_${getFormattedTime()}.csv`);
        else
          link.setAttribute("download", `${ass.nom}_operations_${getFormattedTime()}.csv`);

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
                    "Members": arrData[key].membre,
                    "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                    "Type": arrData[key].debit_credit=='credit'? 'Payment': 'Withdrawal',
                    "Payment Method": arrData[key].mode,
                    "State": arrData[key].etat=='EN_ATTENTE'? 'Waiting'
                            : arrData[key].etat=='VALIDE'? 'Validated'
                            : arrData[key].etat=='REJETE'? 'Rejected'
                            : 'Cancel',
                }
            )
            }else if(locale == "fr"){
                donnees.push(
                    {
                    "Membres": arrData[key].membre,
                    "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleString('fr', options),
                    "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                    "Type": arrData[key].debit_credit=='credit'? 'Versement': 'Retrait',
                    "Méthode de payement": arrData[key].mode,
                    "Etat": arrData[key].etat=='EN_ATTENTE'? 'En attente'
                          : arrData[key].etat=='VALIDE'? 'Validée'
                          : arrData[key].etat=='REJETE'? 'Rejetée'
                          : 'Annulée',
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
          link.setAttribute("download",`${ass.nom}_operations_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download",`${ass.nom}_operations_${getFormattedTime()}.xls`)

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
                    "Members": arrData[key].membre,
                    "Payment Date" : new Date(arrData[key].date_versement*1000).toDateString(),
                    "Amount": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                    "Type": arrData[key].debit_credit=='credit'? 'Payment': 'Withdrawal',
                    "Payment Method": arrData[key].mode,
                    "State": arrData[key].etat=='EN_ATTENTE'? 'Waiting'
                            : arrData[key].etat=='VALIDE'? 'Validated'
                            : arrData[key].etat=='REJETE'? 'Rejected'
                            : 'Cancel',
                }
              )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Membres": arrData[key].membre,
                      "Date de Versement" : new Date(arrData[key].date_versement*1000).toLocaleDateString(undefined, options),
                      "Montant": arrData[key].montant.toLocaleString('en-US', { style: 'currency', currency: ass.devise, minimumFractionDigits: 2 }),
                      "Type": arrData[key].debit_credit=='credit'? 'Versement': 'Retrait',
                      "Méthode de payement": arrData[key].mode,
                      "Etat": arrData[key].etat=='EN_ATTENTE'? 'En attente'
                            : arrData[key].etat=='VALIDE'? 'Validée'
                            : arrData[key].etat=='REJETE'? 'Rejetée'
                            : 'Annulée',
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
              caption = `List of operations`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Members", dataKey: "Members"},
                    {title: "Payment Date", dataKey: "Payment Date"},
                    {title: "Amount", dataKey: "Amount"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Payment Method", dataKey: "Payment Method"},
                    {title: "State", dataKey: "State"}
                  ];
              break;
          case 'fr':
              caption = `Liste des opérations`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Membres", dataKey: "Membres"},
                    {title: "Date de Versement", dataKey: "Date de Versement"},
                    {title: "Montant", dataKey: "Montant"},
                    {title: "Type", dataKey: "Type"},
                    {title: "Méthode de payement", dataKey: "Méthode de payement"},
                    {title: "Etat", dataKey: "Etat"}
                  ];
              break;
        }

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_operations_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_operations_${getFormattedTime()}.pdf`); 
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
        exportExel
    }
