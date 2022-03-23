import axios from '@/axios'

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
