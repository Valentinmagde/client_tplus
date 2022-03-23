
<template>
    <div>
      <div v-if="allRapportParameters && !allRapportParameters.canAcess">
      <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <!-- left -->
        <div class="pt-16">
          <vs-tabs :value="selectedTab" :position="isSmallerScreen ? 'top' : 'left'"
            :class="isSmallerScreen ? 'tabs-shadow-none z-10': 'top-tabs tabs-shadow-none z-10'"
            id="profile-tabs">

            <!-- Paramètres -->
            <vs-tab
              :label="!isSmallerScreen ? $t('setting'): ''" icon-pack="streameline" icon="icon-multiple-users-wifi">
              <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-0 ml-4">
                <param-tag
                  :users="users"
                  :ag= "ag"
                  :roles= "roles"
                  :uuid="uuid"
                  :assId="assId"
                  :isCurrentAg="isCurrentAg"
                  :rapportId="rapportId"
                  :allRapportParameters="allRapportParameters"
                  @update:parametre:rapport="val => updateRapport(val)"
                  @selectedTab="selectedTab = $event"
                />
              </div>
            </vs-tab>

            <!-- Nouvelle -->
            <vs-tab v-if="!admin" :label="!isSmallerScreen ? $t('news'): ''"
              icon-pack="streameline"
              icon="icon-newspaper-fold">
              Assemmblée générale
              <div id="setting" class="tab-general md:mt-0 mt-0 ml-0">
                <new-tag @selectedTab="selectedTab = $event"
                  :roles= "roles"
                  :isCurrentAg="isCurrentAg"
                />
              </div>
            </vs-tab>

            <!-- Presence -->
            <vs-tab :label="!isSmallerScreen ? $t('presenceTitle'): ''"
              v-if="!admin"
              icon-pack="streameline"
              icon="icon-single-neutral-actions-time">
              <div id="setting" class="tab-general md:ml-0 md:mt-0  mt-0 ml-0">
                <presence-tag
                  :users="users"
                  :uuid="uuid"
                  :roles= "roles"
                  :isCurrentAg="isCurrentAg"
                  @selectedTab="selectedTab = $event" :vs_length="rubriques.length"/>
              </div>
            </vs-tab>

            <!-- Sanction -->
            <vs-tab :label="!isSmallerScreen ? $t('sanctionTitle'): ''"
              v-if="!admin"
              icon-pack="streameline"
              icon="icon-single-neutral-actions-warning">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0">
                <sanction-tag
                  :roles= "roles"
                  :users="users"
                  :assId="assId"
                  :uuid="uuid"
                  :isCurrentAg="isCurrentAg"
                  @selectedTab="selectedTab = $event" :vs_length="rubriques.length"/>
              </div>
            </vs-tab>

            <!-- OPeration -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('validationParams'): ''"
              icon-pack="streameline"
              icon="icon-single-neutral-actions-money">
              <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                <operation-tag
                :roles= "roles"
                :isCurrentAg="isCurrentAg"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Ralisation financière -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('financeParams'): ''"
              icon-pack="streameline"
              icon="icon-multiple-actions-money">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
                <realisation-tag
                :roles= "roles"
                :uuid="uuid"
                :isCurrentAg="isCurrentAg"
                @selectedTab="selectedTab = $event"/>
                </div>
            </vs-tab>

            <!-- Attribution lot tontine -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('attributionsLotsTontine'): ''"
              icon-pack="streameline"
              icon="icon-money-bags">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
                <tontine-tag
                :uuid="uuid"
                :roles= "roles"
                :isCurrentAg="isCurrentAg"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Epargne credit -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('creditParams'): ''"
              icon-pack="streameline"
              icon="icon-saving-piggy-coins">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0">
                <epargne-tag
                :users="[]"
                :isCurrentAg="isCurrentAg"
                :roles= "roles"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Decaissement -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('decaissementParams'): ''"
              icon-pack="streameline"
              icon="icon-cash-payment-bag">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
                <decaisse-tag
                :uuid="uuid"
                :roles= "roles"
                :isCurrentAg="isCurrentAg"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Tresorerie -->
            <vs-tab v-if="admin"
              :label="!isSmallerScreen ? $t('treasury'): ''"
              icon-pack="streameline"
              icon="icon-monetization-touch-browser">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
                <tresorerie
                :uuid="uuid"
                :roles= "roles"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Cloturer seance -->
            <vs-tab v-if="admin && rapportId"
              :label="!isSmallerScreen ? $t('closeSession'): ''"
              icon-pack="streameline"
              icon="icon-login-lock">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
                <close-session :uuid="uuid" :assId="assId" :roles= "roles"
                :isCurrentAg="isCurrentAg"
                @selectedTab="selectedTab = $event"/>
              </div>
            </vs-tab>

            <!-- Rubrique -->
            <template v-if="!admin && rubriques.length" >
            <vs-tab
              v-for="rubrique in rubriques"
              :label="!isSmallerScreen ? rubrique.titre: ''"
              icon-pack="streameline" icon="icon-paragraph-normal"
              :key="rubrique.id">
              <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0 pl-4">
                <rubrique-tag
                  :item="rubrique"
                  :uuid="uuid"
                  :roles= "roles"
                  :assId="assId"
                  @delete:rubrique="del"
                  @update:rubrique="update"
                  @selectedTab="selectedTab = $event"
                />
              </div>
            </vs-tab>
            </template>
          </vs-tabs>

          <div v-if="admin && tresoreriesData.length > 0 && !isSmallerScreen" class="z-10 absolute treasury-tab  ul-tabs vs-tabs--ul ul-tabs-left" style="top: 42rem; width: 260px;">
              <vx-card no-shadow :title="$t('treasury')" style="background: #f7f7f7">
                  <!-- <vx-timeline :data="timelineData" /> -->
                  <ul class="clearfix overflow-auto" style="max-height: 15rem">
                    <li class="mb-4" :key="ind" v-for="(activite, ind) in tresoreriesData">
                        <div class="timeline-info">
                            <p>{{activite.activite.nom}}</p>
                            <h6 class="font-semiboldc">{{ (activite.tresorerie) | formatMoney(devise) }}</h6>
                        </div>
                    </li>
                </ul>
              </vx-card>
          </div>
          <vx-card no-shadow style="height: 23rem; width: 260px; background: #f7f7f7"></vx-card>
        </div>
      </div>

      <div v-else-if="allRapportParameters == 'null'">
      </div>

      <div v-else>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
          <!-- left -->
          <div class="pt-16">
            <vx-card class="mb-base">
              <p>{{$t('noElementFound')}}</p>
            </vx-card>
          </div>

        </div>
    </div>

</template>


<script type="text/javascript">
	import SanctionTag from './components/Sanction.component'
	import PresenceTag from './components/Presence.component'
	import RubriqueTag from './components/Rubriques.component'
  // import RapportTag from './Rapport'
	import ParamTag from './components/Parameters.component'
  import DecaisseTag from './components/Disbursements.component'
  import TontineTag from './components/Tontine.component'
  import EpargneTag from './components/Epargne.component'
  import RealisationTag from './components/Realisations.component'
  // import LotTag from './Lot'
  // import TraitementTag from './Traitement'
  import OperationTag from './components/Operations.component'
  import NewTag from './components/News.component'
  import Tresorerie from './components/Treasury.component'
  import CloseSession from './components/CloseSession.component'

  const display = (error) => window.console.log(error)


	export default {
		name:"layout-seance",
    created(){
        this.selectedTab = this.selecTab

        var association_courante = this.$store.state.association.currentAssociation

        let payload = {
          resourceUrl:"api/association/"+association_courante.id+"/activites/tresorerie",
          commitAction: 'SET_TRESORERIES',
        }

        this.$store.dispatch("association/fetchFinances",payload)
        .then(()=>{
        })
        .catch((error)=>{
          window.console.log(error)
        })

        this.devise = association_courante.devise
    },
		props: {
      selecTab: {
        required: true
      },
      ag: {
        required: true
      },
      isCurrentAg:{
        required: true
      },
			admin: {
				type: Boolean,
				default: () => false,
			},
      assId: {
        required:true
      },
      allRapportParameters:{
        default: () => {}
      },
      rapportId: {
        required: false
      },
      roles:{
        required: true
      },
			rubriques: {
				type: Array,
				default: () => [],
			},
      uuid: {
        required: true
      },
      users: {
        type: Array,
        required: true
      }
		},

		methods: {
      selectTab(event){
          window.console.log(event);
      },

      updateRapport(val){
        this.$emit('update:rapport',val)
      },
      del(val){
        this.$emit('delete:rubrique',val)
      },
      update(val){
        this.$emit('update:rubrique',val)
      }
    },
    watch: {
      selecTab: function(newValue, oldValue){
        if(newValue) this.selectedTab = newValue
           display(oldValue)
      }
    },
		computed: {
			disable(){
				return (this.rubriqueTitle.length >= 3) ? false : true
      },

      isSmallerScreen () {
        return this.$store.state.windowWidth < 768
      },

      tresoreriesData(){
        return this.$store.state.association.tresoreries
      },
		},
		components: {
			SanctionTag,
			PresenceTag,
			RubriqueTag,
			ParamTag,
      // RapportTag,
      DecaisseTag,
      TontineTag,
      EpargneTag,
      RealisationTag,
      // LotTag,
      // TraitementTag,
      OperationTag,
      NewTag,
      Tresorerie,
      CloseSession
		},
		data:()=>({
			rubriqueTitle:'',
			rubriqueComment: '',
      selectedTab: 0,
			//rendering: 0,
      //rapportId: '',
      devise: null

    })
	}
</script>
<style lang="scss">
  #profile-tabs {
    .vs-tabs--content {
      padding: 0;
    }
  }

  .product-name {
    max-width: 7rem;
  }

  .treasury-tab{
    .vx-card__title{
      margin-left: -10px;

      h4{
        font-size: 1rem !important;
      }
    }

    [dir] .vs-con-table .vs-con-tbody {
      background: #f8f8f8;
      border: none !important;
    }

    .vs-table--tbody-table {
        width: 100%;
        margin: 0;
        min-width: 260px !important;
        position: relative;
    }

    .vs-con-table .vs-con-tbody .vs-table--tbody-table {
        font-size: .85rem !important;
    }
  }


  .tabs-title {
    width: 200px;
    padding: 2px 5px;

    /* BOTH of the following are required for text-overflow */
    white-space: nowrap;
  }
  .top-tabs {
    .vs-tabs--li button {
      font-family: inherit;
      color: inherit;
      width: 260px !important;
      text-align: left;
    }

    .vs-tabs--li {
      white-space: pre-wrap !important;
    }
  }
</style>
