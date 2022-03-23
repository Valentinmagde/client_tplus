<template>
    <!-- ACTION - DROPDOWN -->
        <vs-dropdown vs-trigger-click class="ml-auto md:block cursor-pointer fixed z-50" style="right:35px">
            <vs-button  icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

            <vs-dropdown-menu class="w-64">
                <vs-dropdown-item >
                    <div @click="$router.push('/association/finances').catch(() => {})" class="ml-2 flex items-center">
                        <span>{{$t('listOfOperations')}}</span>
                    </div>
                </vs-dropdown-item>
                <vs-dropdown-item >
                    <div @click="$router.push({name: 'association:finances:histories'}).catch(() => {})" class="ml-2 flex items-center">
                        <span>{{$t('TransactionHistory')}}</span>
                    </div>
                </vs-dropdown-item>
                <vs-dropdown-item>
                    <div class="ml-2 flex items-center" @click="$router.push('/association/finances/payment').catch(() => {})">
                        <span>{{$t('saveAPayment')}}</span>
                    </div>
                </vs-dropdown-item>
                <vs-dropdown-item >
                    <div class="ml-2 flex items-center" @click="$router.push('/association/finances/settlements').catch(() => {})">
                        <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                        <span>{{$t('settlement')}}</span>
                    </div>
                </vs-dropdown-item>
                <vs-divider class="mt-1 mb-1"/>
                 <vs-dropdown-item>
                    <div @click="$router.push('/association/finances/transfer').catch(() => {})" class="ml-2 mb-2 flex items-center">
                        <span>{{$t('moveFunds')}}</span>
                    </div>
                </vs-dropdown-item>
            </vs-dropdown-menu>
        </vs-dropdown>
</template>
