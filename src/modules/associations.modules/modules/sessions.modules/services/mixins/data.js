export default {
  data: () => ({
        association: null,
        backgroundLoading:'primary',
        colorLoading:'#fff',
        isMounted: false,
        devise: '',
	}),
	mounted(){
		this.isMounted= true
	} ,
	methods: {
		stam(strDate){
			var datum = Date.parse(strDate);
			return datum/1000;
		},
		startLoding(id="button-with-loading"){
			this.$vs.loading({
				background: this.backgroundLoading,
				color: this.colorLoading,
				container: `#${id}`,
				scale: 0.45
			})
		},

		previous(newVal){
			this.$emit('selectedTab',newVal)
		},

		next(newVal){
			this.$emit('selectedTab',newVal)
		},

		stopLoding(id){
			this.$vs.loading.close( `#${id} > .con-vs-loading`)

		},
		setparamSeanceInfos(val=undefined){
			if(val)
				return localStorage.setItem('parametres_seance',JSON.stringify(val))
			else
				return localStorage.removeItem('parametres_seance')
    },
		getparamSeanceInfos(){
			const newData = JSON.parse(localStorage.getItem('parametres_seance'))
			return newData
		},
	},

	computed: {
    currentPage() {
      if(this.isMounted) {
        if(this.$refs.table != undefined)
          return this.$refs.table.currentx
        else return 1
      }
      return 0
    },
		queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.members.length
    }
	}
}
