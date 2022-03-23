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
                "Members": arrData[key].membre,
                "Wording" : arrData[key].libelle,
                "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                "Amount": arrData[key].montant,
             }
           )
          }else if(locale == "fr"){
            donnees.push(
             {
                "Membres": arrData[key].membre,
                "Libellé" : arrData[key].libelle,
                "Date limite": new Date(arrData[key].date_limite*1000).toLocaleString('fr', options),
                "Montant": arrData[key].montant,
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
                    "Members": arrData[key].membre,
                    "Wording" : arrData[key].libelle,
                    "Deadline": new Date(arrData[key].date_limite*1000).toDateString(),
                    "Amount": arrData[key].montant,
                }
            )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Membres": arrData[key].membre,
                      "Libellé" : arrData[key].libelle,
                      "Date limite": new Date(arrData[key].date_limite*1000).toLocaleString('fr', options),
                      "Montant": arrData[key].montant,
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

    function exportPDF(arrData, ass, act){
        getDataUri(ass.logo, function (dataUri) {                    
            generatePdf(arrData, dataUri, ass, act);
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

    function generatePdf(arrData, img, ass, act) {                
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
                    "Amount": arrData[key].montant,
                 }
               )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Membres": arrData[key].membre,
                      "Libellé" : arrData[key].libelle,
                      "Date limite": new Date(arrData[key].date_limite*1000).toLocaleString('fr', options),
                      "Montant": arrData[key].montant,
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
              caption = `ACTIVITY SETTLEMENT ${act.nom}`
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
              caption = `ECHEANCES DE L'ACTIVITE ${act.nom}`
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
          doc.save(`${ass.nom}_échéances_${getFormattedTime()}.pdf`); 
    }

    function getFormattedTime() {
      var today = new Date();
      var y = today.getFullYear();
      // JavaScript months are 0-based.
      var m = today.getMonth() + 1;
      var d = today.getDate();
      var h = today.getHours();
      var mi = today.getMinutes();
      var s = today.getSeconds();
      return `${y}_${m}_${d}_${h}_${mi}_${s}`;
    }

    export default {
        csvExport,
        exportPDF,
        exportExel,
    }
