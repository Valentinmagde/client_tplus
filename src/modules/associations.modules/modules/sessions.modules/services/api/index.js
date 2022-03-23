
import axios from '@/axios'


export const getAssociationMembres = (credentials) => {
	return axios.get(`api/association/${credentials.id}/membre`)
}

export const getAllPresence = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/ag/${credentials.agId}/presence`)
}

// récupérer la présence d'un unique membre à une assemblé générale)
export const getPresentceMembres = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/membre/${credentials.membreId}/ag/${credentials.agId}/presence`)
}

// création d'une présence pour un membre
export const createPresenceMembre = (credentials) => {
	//window.console.log(credentials)
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/presence/create`,

		data: {
			membre_id: credentials.membre_id,
			ag_id: credentials.agId,
			status: credentials.status,
			raison: credentials.raison,
		}
	});

}

// récupérer tout les rapports d'une association
export const getAllRapport = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/rapports`)
}

// récupérer le rapport d'une ag
export const getRapportAg = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/ag/${credentials.agId}/rapport`)
}

//enregistrer un rapport à une ag
export const createRapportAg = (credentials) => {

	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/ag/${credentials.agId}/rapport`,
		data: {
			created_by: credentials.created_by,
			hote: credentials.hote,
			presidence: credentials.presidence,
			secretaire: credentials.secretaire,
			lieu: credentials.lieu,
			date_effective: credentials.date_effective,
			jitsi_room: credentials.jitsi_room
		}
	});
}

// update un rapport
export const updateRapportAg = (credentials) => {
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/rapport/${credentials.rapportId}/update`,

		data: {
			created_by: credentials.created_by,
			hote: credentials.hote,
			presidence: credentials.presidence,
			secretaire: credentials.secretaire,
			lieu: credentials.lieu,
			date_effective: credentials.date_effective,
			jitsi_room: credentials.jitsi_room
		}
	});
}

// get sanction Ag un rapport
export const getAllSactionsAg = (credentials) => {

	return axios.get(`api/ags/${credentials.agId}/sanctions`)
}

// créer une section à un rapport
export const createSection = (credentials) => {
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/rapport/${credentials.rapportId}/section`,

		data: {
			titre: credentials.title,
			contenu: credentials.contenu
		}
	});

}
// créer une section à un rapport
export const createSanction = (credentials) => {
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/sanction`,

		data: {
			membres_id: credentials.userId,
			ags_id: credentials.ags_id,
			montant: credentials.montant,
			commentaire: credentials.commentaire,
			type: credentials.type
		}
	});

}

// supprimer une rubrique
export const deleteRubrique = (credentials) => {
	/* window.console.log(credentials) */
	return axios({
	method: 'delete',
		url: `api/association/${credentials.assId}/section/${credentials.secId}/delete`,

	});

}

// supprimer une sanction
export const deleteSanction = (credentials) => {
	/* window.console.log(credentials) */
	return axios({
	method: 'delete',
		url: `api/association/${credentials.assId}/sanctions/${credentials.sancId}/delete`,

	});

}

// supprimer un type sanction
export const deleteSanctionType = (credentials) => {
	/* window.console.log(credentials) */
	return axios({
	method: 'delete',
		url: `api/association/${credentials.assId}/type/sanctions/${credentials.sancId}/delete`,
	});

}


// créer un type de sanction
export const createTypeSanction = (credentials) => {
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/type/sanction`,

		data: {
			association_id: credentials.assId,
			nom: credentials.name,
			montant: credentials.montant,
			description: credentials.descript,
		}
	});

}

// get un type de sanction
export const getTypeSanction = (credentials) => {
	return axios({
	method: 'get',     //put
		url: `api/association/${credentials.assId}/type/sanctions`,
	});

}

// update un type sanction
export const updateTypeSanction = (credentials) => {
	return axios({
	method: 'post',
		url: `api/association/${credentials.assId}/type/sanction/${credentials.sancId}/update`,

		data: {
			association_id: credentials.assId,
			nom: credentials.name,
			montant: credentials.montant,
			description: credentials.descript,
		}
	});
}

// update une section
export const updateSection = (credentials) => {
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/section/${credentials.sectionId}/update`,

		data: {
			titre: credentials.titre,
			contenu: credentials.contenu
		}
	});
}


export const getAllActivity = (credentials) => {
	return axios({
	method: 'get',     //put
		url: `api/association/${credentials.assId}/activite/type/Tontine/ag/${credentials.agId}`,


	});
}


export const getAllOperation = (credentials) => {
	return axios({
	method: 'get',     //put
		url: `api/association/${credentials.assId}/operations`,


	});
}

export const getAllMutuelle = (credentials) => {
	return axios({
	method: 'get',     //put
		url: `api/association/${credentials.assId}/mutuelles`,


	});
}


export const getAllFinantialAction = (credentials) => {
	//window.console.log(credentials)
	return axios({
	method: 'get',     //put
		url: `api/member/all/association/${credentials.assId}/echeances/ag/${credentials.agId}`,


	});
}


// récupérer tout les credits en attente d'une association
export const getCreditEnAttenteApi = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/credits`)
}

//Cloturer une ag
export const clotureAg = (credentials) => {
	return axios.get(`api/ag/${credentials.agId}/cloture`)
}

/* Générer Rapport */
export const genererRapportAg = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/ag/${credentials.agId}/rapport/pdf`)
}

export const postApprouveCreditEnAttenteApi = (credentials) => {
	return axios({
	method: 'get',     //put
		url: `api/mutuelle/credit/${credentials.creditId}/approuve`,


	});
}

export const postRejetCreditEnAttenteApi = (credentials) => {
	//window.console.log(credentials)
	return axios({
	method: 'get',     //put
		url: `api/activite/${credentials.activiteId}/mutuelle/credit/${credentials.creditId}/reject`,


	});
}

export const getStatisiqueDecaissementApi = (credentials) => {

	return axios({
	method: 'get',     //put
		url: `api/member/all/association/${credentials.assId}/echeances/ag/${credentials.agId}/decaissement`,


	});
}

export const getAvoirs = (credentials) => {

	return axios({
	method: 'get',     //put
		url: `api/association/${credentials.assId}/comptes`,


	});
}

export const getAllActivityMembreAccountApi = (credentials) => {

	return axios({
	method: 'get',     //put
		url: `/api/activite/${credentials.activiteId}/comptes/all`,


	});
}

export const postAssignLotTontitne = (credentials) => {
  //window.console.log(credentials)
	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/tontine/${credentials.tontine.idTontine}/assignation/single`,

		data:{
			lot: credentials.tontine.user,
			type: credentials.typeof,
			interet: (credentials.interet) ? credentials.interet : 0,
			enchere: (credentials.enchere) ? credentials.enchere : 0,
			remboursement: credentials.remboursement
		}
	});
}

export const deleteLotSecondaire = (credentials) => {

	return axios({
	method: 'delete',
		url: `api/tontine/${credentials.tontId}/lot/${credentials.lotId}/delete`,

	});

}

/* Mettre à jour un credit */
export const postUpdateCredit = (credentials) => {

	return axios({
	method: 'post',     //put
		url: `api/activite/${credentials.activites_id}/mutuelle/${credentials.mutuelle_id}/credit/${credentials.credit_id}/update`,

		data: credentials.data
	});
}

export const postAssignLotPrincipal = (credentials) => {

	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/tontine/${credentials.tontine.idTontine}/assignation/principal`,

		data:{
			lot: credentials.lot,
			enchere: credentials.enchere
		}
	});
}

export const postDesasignerLotPrincipal = (credentials) => {

	return axios({
	method: 'post',     //put
		url: `api/association/${credentials.assId}/tontine/${credentials.idTontine}/desassignation/principal`,

		data:{
			lot: credentials.lot
		}
	});
}

//recuperer les rôles de l'utilisateur connecté
export const getAllUserRolesApi = (credentials) => {

	return axios({
	method: 'get',
		url: `/api/association/${credentials.assId}/user/${credentials.userId}/roles`,


	});
}

export const getAllCycleApi = (credentials) => {

	return axios({
	method: 'get',
		url: `/api/association/${credentials.assId}/cycle/`,


	});
}

export const getAllAgOfCycleApi = (credentials) => {

	return axios({
	method: 'get',
		url: `/api/association/${credentials.assId}/cycle/${credentials.cycleId}/ags`,


	});
}


export const postUploadFile = (credentials) => {

	let formData = new FormData();

	formData.append('rapport', credentials.file);


	return axios({
	method: 'post',     //put
		url: `/api/association/${credentials.assId}/${credentials.agId}/rapport/upload`,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		data:formData
	});
}
