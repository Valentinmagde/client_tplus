
import axios from '@/axios'

export const getActivity = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/activite/${credentials.actId}`)
}

export const getAssociationMembers = (credentials) => {
	return axios.get(`api/association/${credentials.assId}/membre`)
}

export const getActivityAccounts = (credentials) => {
	return axios.get(`api/activite/${credentials.actId}/comptes/all`)
}

// création d'une présence pour un membre
export const registerMembers = (credentials) => {
	//window.console.log(credentials)
	return axios({
	method: 'post',     //put
		url: `api/activite/membres/register`,
		data: credentials.data
	});

}

// Ajout d'un membre dans une activité tontine
export const tontineRegisterMembers = (credentials) => {
	//window.console.log(credentials)
	return axios({
	method: 'post',     //put
		url: `api/activite/${credentials.actId}/membre/${credentials.memId}/register/one`,
		data: credentials.data
	});

}

// Enlever un membre dans une activité
export const deleteMember = (credentials) => {
	/* window.console.log(credentials) */
	return axios({
	method: 'delete',
		url: `api/tontine/activite/${credentials.actId}/compte/${credentials.cptId}/delete`,
	});

}
