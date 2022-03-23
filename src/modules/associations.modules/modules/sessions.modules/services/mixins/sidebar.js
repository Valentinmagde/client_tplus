import DataView from '../../../../components/sidebar/DataViewSidebar.component'

export default {
	components: {
		DataView
	},
	data: () => ({
		addNewDataSidebar: false,
		emptyData: {}
	}),
	methods: {
		toggleDataSidebar(val=false) {
            this.addNewDataSidebar = val
        },
	}
}
