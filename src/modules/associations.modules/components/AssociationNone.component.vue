<template>
    <div class="pl-4">
        <vs-list-item class="cursor-pointer" @click.native="createAssociation()">
            <p class="font-semibold">{{ $t('createAnAssociation') }}</p>
            <span class="text-grey activity-desc">{{ $t('createAssociationSubtitle') }}</span>
            <template slot="avatar">
                <icon
                    name="multiple-circle"
                    :size=30
                    color="#3EB2FB"
                    class="mr-6"/>
            </template>
        </vs-list-item>
        <br>
        <vs-list-item @click.native="joinAssociation()" class="cursor-pointer">
            <p class="font-semibold">{{ $t('joinAssociation') }}</p>
            <span class="text-grey activity-desc">{{ $t('joinAssociationSubtitle') }}</span>
            <template slot="avatar">
                <icon
                    name="multiple-actions-add"
                    :size=30
                    color="#3EB2FB"
                    class="mr-6"/>
            </template>
        </vs-list-item>
        <br>
        <!-- <vs-list-item @click.native="startAssociation()" :title="$t('startFind')"  :subtitle="$t('startSubtitle')" class="cursor-pointer">
            <template slot="avatar">
               <icon name="multiple-actions-view" :size=30 color="#3EB2FB"></icon>
                &nbsp;&nbsp;&nbsp;
            </template>
        </vs-list-item> -->
        <br>
    </div>
</template>

<script>

require('@syncfusion/ej2-base/styles/material.css');
require('@syncfusion/ej2-layouts/styles/material.css');

export default {
  methods: {
    createAssociation(){
        this.$router.push('/association/create')
    },
    joinAssociation(){
        this.$router.push('/association/join')
    },
    startAssociation(){
        this.$router.push('/association/search')
    },
    profile(){
        this.$router.push('/user/profile')
    },
  }
}
</script>
<style lang="css">
    .activity-desc {
            font-size: .9rem;
        }
</style>
