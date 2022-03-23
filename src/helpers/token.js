export default {
	
	getStore(){

			let storage = null;

			if (localStorage.getItem('tpls')){
					let tplsStorage = JSON.parse(localStorage.getItem('tpls'))
					storage = {
							accessToken: tplsStorage.accessToken_tpls,
							refreshToken: tplsStorage.refreshToken_tpls,
							expires_in: tplsStorage.expires_in_tpls,
							type: 'localStorage'
					}
			}

			if(sessionStorage.getItem('tpls')){
					let tplsStorage = JSON.parse(sessionStorage.getItem('tpls'))
					storage = {
							accessToken: tplsStorage.accessToken_tpls,
							refreshToken: tplsStorage.refreshToken_tpls,
							expires_in: tplsStorage.expires_in_tpls,
							type: 'sessionStorage'
					}
			}

			return storage;
		},


		getAccessToken(){
			let storage = this.getStore()

			return (storage && storage.accessToken) ? storage.accessToken : null
		},

		setAccessToken(payload){
			let storage = this.getStore()

			let checkStoreType = ('localStorage' === storage.type) ? true: false;

			this.processStorage(payload, checkStoreType)

		},

		getRefreshToken(){
			let storage = this.getStore()

			return (storage && storage.refreshToken) ? storage.refreshToken : null
		},

  
		processStorage(response, localStore=true){
			

			let processStorage = {
						accessToken_tpls: response.data.data.bearerData,
						refreshToken_tpls: response.data.data.refresh_token,
						expires_in_tpls: response.data.data.expires_in,
						type: (localStore) ? 'localStorage': 'sessionStorage'
			}

			if(localStore)
					localStorage.setItem("tpls", JSON.stringify(processStorage))
			else
					sessionStorage.setItem("tpls", JSON.stringify(processStorage))
		},

		clear(){
			localStorage.clear()
			sessionStorage.clear()
		}
}
