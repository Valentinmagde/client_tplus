    //importation de jspdf
    import jsPDF from 'jspdf'
    import 'jspdf-autotable'
    // i18n
    import i18n from '@/services/i18n/i18n.js'

    //exporation du tableau en csv
    function csvExport(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
            var users = []
            var $inc = 0
            let userData = arrData[key].users

            Object.keys(userData).forEach(function(key){
                users[$inc] =  userData[key].firstName
                $inc ++
            })
          // Traduction selon la langue de l'utilisateur
          if (locale == "en"){
            donnees.push(
             {
                "Account": arrData[key].firstName,
                "Date" : new Date(arrData[key].date_created*1000).toDateString(),
                "Users": users,
                "Status": arrData[key].etat=='init'? 'Creation'
                        : arrData[key].etat=='connect'? 'Connection'
                        : arrData[key].etat=='activate'? 'Activate'
                        : arrData[key].etat=='desactivate'? 'Desactivate'
                        : 'Disconnect'
             }
           )
          }else if(locale == "fr"){
            donnees.push(
             {
                "Compte": arrData[key].firstName,
                "Date" : new Date(arrData[key].date_created*1000).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
                "Utilisateurs": users,
                "Statut": arrData[key].etat=='init'? 'Création'
                        : arrData[key].etat=='connect'? 'Connexion'
                        : arrData[key].etat=='activate'? 'Activé'
                        : arrData[key].etat=='desactivate'? 'Desactivé'
                        : 'Deconnecté'
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
          link.setAttribute("download", `${ass.nom}_members_${getFormattedTime()}.csv`);
        else
          link.setAttribute("download", `${ass.nom}_membres_${getFormattedTime()}.csv`);

        link.click();
    }


     //exporation du tableau en csv
    function exportExel(arrData, ass) {
        var donnees = []
        const locale = i18n.locale; //Recupération de la langue de l'utilisateur

         Object.keys(arrData).forEach(function(key){
            var users = []
            var $inc = 0
            let userData = arrData[key].users

            Object.keys(userData).forEach(function(key){
                users[$inc] =  userData[key].firstName
                $inc ++
            })
          // Traduction selon la langue de l'utilisateur
          if (locale == "en"){
            donnees.push(
             {
                "Account": arrData[key].firstName,
                "Date" : new Date(arrData[key].date_created*1000).toDateString(),
                "Users": users,
                "Status": arrData[key].etat=='init'? 'Creation'
                        : arrData[key].etat=='connect'? 'Connection'
                        : arrData[key].etat=='activate'? 'Activate'
                        : arrData[key].etat=='desactivate'? 'Desactivate'
                        : 'Disconnect'
             }
           )
          }else if(locale == "fr"){
            donnees.push(
             {
                "Compte": arrData[key].firstName,
                "Date" : new Date(arrData[key].date_created*1000).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
                "Utilisateurs": users,
                "Statut": arrData[key].etat=='init'? 'Création'
                        : arrData[key].etat=='connect'? 'Connexion'
                        : arrData[key].etat=='activate'? 'Activé'
                        : arrData[key].etat=='desactivate'? 'Desactivé'
                        : 'Deconnecté'
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

        if(locale == 'en' )
          link.setAttribute("download", `${ass.nom}_members_${getFormattedTime()}.xls`);
        else
          link.setAttribute("download", `${ass.nom}_membres_${getFormattedTime()}.xls`);

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
            var users = []
            var $inc = 0
            let userData = arrData[key].users

            Object.keys(userData).forEach(function(key){
                users[$inc] =  userData[key].firstName
                $inc ++
            })

            if (locale == "en"){
                donnees.push(
                {
                  "Account": arrData[key].firstName,
                  "Date" : new Date(arrData[key].date_created*1000).toDateString(),
                  "Users": users,
                  "Status": arrData[key].etat
                }
              )
            }else if(locale == "fr"){
                donnees.push(
                    {
                      "Compte": arrData[key].firstName,
                      "Date" : new Date(arrData[key].date_created*1000).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
                      "Utilisateurs": users,
                      "Statut": arrData[key].etat=='init'? 'Création'
                              : arrData[key].etat=='connect'? 'Connexion'
                              : arrData[key].etat=='activate'? 'Activé'
                              : arrData[key].etat=='desactivate'? 'Desactivé'
                              : 'Deconnecté'
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
          cellWidth: 'wrap',
          startY: doc.lastAutoTable.finalY + 20
        }
        
        let caption = ""
        /* let txtWidth2 = "" */
        let splitDescription = "";

        switch(locale){
          case 'en':
              caption = `List of members`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Account", dataKey: "Account"},
                    {title: "Date", dataKey: "Date"},
                    {title: "Users", dataKey: "Users"},
                    {title: "Status", dataKey: "Status"}
                  ];
              break;
          case 'fr':
              caption = `Liste des membres`
              splitDescription = doc.splitTextToSize(caption.toUpperCase(), 380)
              /* txtWidth2 = doc.getTextWidth(caption) > 70 ? doc.getTextWidth(caption) - 70: 0; */
              doc.setFontType('bold');
              doc.setLineWidth(30)
              /* doc.text(40, 180, splitDescription); */
              doc.setFontSize(14);
              doc.text(splitDescription, doc.internal.pageSize.getWidth()/2, 180, { align: "center" });
              columns = [
                    {title: "Compte", dataKey: "Compte"},
                    {title: "Date", dataKey: "Date"},
                    {title: "Utilisateurs", dataKey: "Utilisateurs"},
                    {title: "Statut", dataKey: "Statut"}
                  ];
              break;
        }

        doc.autoTable(columns, donnees, options);

        if(locale == 'en')
          doc.save(`${ass.nom}_members_${getFormattedTime()}.pdf`); 
        else
          doc.save(`${ass.nom}_membres_${getFormattedTime()}.pdf`); 
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
