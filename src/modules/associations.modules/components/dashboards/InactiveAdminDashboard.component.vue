<template>
  <div v-if="association.etat == false">
      <div class="vx-row">

        <div class="vx-col w-full mb-base">
          <vx-card slot="no-body" class="text-center bg-primary-gradient greet-user">
                      <img src="@/assets/images/elements/decore-left.png" class="decore-left" alt="Decore Left" width="200" >
                      <img src="@/assets/images/elements/decore-right.png" class="decore-right" alt="Decore Right" width="175">
            <img v-if="association.logo" class="mb-4 inline-flex rounded-full text-white shadow img-logo"
              :src="association.logo" width="85" height="85"/>
            <img v-else class="mb-4 bg-primary inline-flex rounded-full text-white shadow img-logo"
              src="@/assets/images/pages/media.png"  width="85" height="85"/>
            <h1 class="mb-6 text-white">{{ association.nom }}</h1>
            <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white">{{$t('yourAssociationIsNowRegistered')}}</p>
          </vx-card>
        </div>
      </div>

      <div class="vx-row">
          <div class="vx-col w-full mb-base">
              <vx-card :title="$t('suggestedStepsForSetting')">
                  <!-- <vx-timeline :data="timelineData" /> -->
                  <ul class="vx-timeline">
                    <li class="cursor-pointer" @click="$router.push('/association/administration/members')">
                        <div class="timeline-icon bg-primary">
                            <feather-icon icon="PlusIcon" svgClasses="text-white stroke-current w-5 h-5" />
                        </div>
                        <div class="timeline-info">
                            <p class="font-semibold">{{ $t('addMembersToYourAssociation') }}</p>
                            <span class="text-grey activity-desc">{{ $t('addMembersToYourAssociationSubtitle') }}</span>
                        </div>
                    </li>
                    <li class="cursor-pointer" @click="$router.push('/association/administration/cycles')">
                        <div class="timeline-icon bg-warning">
                            <feather-icon icon="RefreshCwIcon" svgClasses="text-white stroke-current w-5 h-5" />
                        </div>
                        <div class="timeline-info">
                            <p class="font-semibold">{{ $t('createConfigureCycle') }}</p>
                            <span class="text-grey activity-desc">{{ $t('createConfigureCycleSubtitle') }}</span>
                        </div>
                    </li>
                    <li class="cursor-pointer" @click="$router.push('/association/administration/activity/create')">
                        <div class="timeline-icon bg-danger">
                            <icon :size="17" color="#fff" name="tool-box" class="mr-0"/>
                        </div>
                        <div class="timeline-info">
                            <p class="font-semibold">{{ $t('addActivities') }}</p>
                            <span class="text-grey activity-desc">{{ $t('addActivitiesSubtitle') }}</span>
                        </div>
                    </li>
                    <li class="cursor-pointer" @click="$router.push('/association/administration/finances/operations')">
                        <div class="timeline-icon bg-success">
                            <icon :size="17" color="#fff" name="saving-bank-1" class="mr-0"/>
                        </div>
                        <div class="timeline-info">
                            <p class="font-semibold">{{ $t('adjustFinancialParameters') }}</p>
                            <span class="text-grey activity-desc">{{ $t('adjustFinancialParametersSubtitle') }}</span>
                        </div>
                    </li>
                    <li class="cursor-pointer" @click="$router.push('/association/administration/members')">
                        <div class="timeline-icon bg-primary">
                            <feather-icon icon="UserPlusIcon" svgClasses="text-white stroke-current w-5 h-5" />
                        </div>
                        <div class="timeline-info">
                            <p class="font-semibold">{{ $t('inviteMemberOfAssociation') }}</p>
                            <span class="text-grey activity-desc">{{ $t('inviteMemberOfAssociationSubtitle') }}</span>
                        </div>
                    </li>
                </ul>
              </vx-card>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      association: '',
    }
  },
  created() {
    this.association = this.$store.state.association.currentAssociation
  }
}
</script>
